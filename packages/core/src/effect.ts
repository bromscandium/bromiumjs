/**
 * Effect system for reactive side effects, computed values, and watchers.
 * @module
 */

import {
  EffectFn,
  EffectOptions,
  cleanup,
  pushEffect,
  popEffect,
  track,
  trigger,
  getActiveEffect,
} from './dep.js';
import { Ref, isRef, ComputedRef, RefFlag } from './ref.js';

function trackComputed(computed: any): void {
  if (getActiveEffect()) {
    track(computed, 'value');
  }
}

function triggerComputed(computed: any): void {
  trigger(computed, 'value');
}

interface ReactiveEffect<T = any> extends EffectFn {
  (): T;
}

/**
 * Creates a reactive effect that automatically tracks dependencies and re-runs when they change.
 *
 * @param fn - The effect function to run
 * @param options - Configuration options for the effect
 * @returns The effect function, which can be called manually or used for cleanup
 *
 * @example
 * ```ts
 * const count = ref(0);
 *
 * // Runs immediately and re-runs when count changes
 * effect(() => {
 *   console.log('Count is:', count.value);
 * });
 *
 * // Lazy effect with custom scheduler
 * const runner = effect(() => count.value * 2, {
 *   lazy: true,
 *   scheduler: (fn) => queueMicrotask(fn)
 * });
 * ```
 */
export function effect(fn: () => void, options?: EffectOptions): EffectFn;
export function effect<T>(fn: () => T, options?: EffectOptions): ReactiveEffect<T>;
export function effect(fn: () => any, options?: EffectOptions): EffectFn {
  const effectFn: EffectFn = () => {
    cleanup(effectFn);
    pushEffect(effectFn);
    try {
      return fn();
    } finally {
      popEffect();
    }
  };

  effectFn.deps = new Set();
  effectFn.options = options;

  if (!options?.lazy) {
    effectFn();
  }

  return effectFn;
}

class ComputedRefImpl<T> {
  private _value!: T;
  private _dirty = true;
  private _effect: ReactiveEffect<T>;
  public readonly [RefFlag] = true;

  constructor(getter: () => T) {
    this._effect = effect(getter, {
      lazy: true,
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerComputed(this);
        }
      },
    }) as ReactiveEffect<T>;
  }

  get value(): T {
    trackComputed(this);
    if (this._dirty) {
      this._value = this._effect();
      this._dirty = false;
    }
    return this._value;
  }
}

/**
 * Creates a computed ref that derives its value from other reactive state.
 * The value is lazily evaluated and cached until dependencies change.
 *
 * @param getter - A function that computes the value from reactive sources
 * @returns A read-only ref containing the computed value
 *
 * @example
 * ```ts
 * const count = ref(0);
 * const doubled = computed(() => count.value * 2);
 *
 * console.log(doubled.value); // 0
 * count.value = 5;
 * console.log(doubled.value); // 10
 * ```
 */
export function computed<T>(getter: () => T): ComputedRef<T> {
  return new ComputedRefImpl(getter) as ComputedRef<T>;
}

/** A watch source can be either a ref or a getter function */
type WatchSource<T> = Ref<T> | (() => T);

/** Callback invoked when a watched source changes */
type WatchCallback<T> = (newValue: T, oldValue: T | undefined) => void;

/**
 * Configuration options for the watch function.
 */
interface WatchOptions {
  /** If true, the callback is invoked immediately with the current value */
  immediate?: boolean;
  /** If true, deeply watches nested object properties (not yet implemented) */
  deep?: boolean;
}

/**
 * Watches a reactive source and invokes a callback when it changes.
 *
 * @param source - A ref or getter function to watch
 * @param callback - Function called with new and old values when the source changes
 * @param options - Configuration options
 * @returns A function to stop watching
 *
 * @example
 * ```ts
 * const count = ref(0);
 *
 * // Watch a ref
 * const stop = watch(count, (newVal, oldVal) => {
 *   console.log(`Changed from ${oldVal} to ${newVal}`);
 * });
 *
 * // Watch a getter
 * watch(() => state.nested.value, (newVal) => {
 *   console.log('Nested value changed:', newVal);
 * });
 *
 * // With immediate option
 * watch(count, callback, { immediate: true });
 *
 * stop(); // Stop watching
 * ```
 */
export function watch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options?: WatchOptions
): () => void {
  let getter: () => T;

  if (isRef(source)) {
    getter = () => source.value;
  } else if (typeof source === 'function') {
    getter = source;
  } else {
    getter = () => source;
  }

  let oldValue: T | undefined;

  const job = () => {
    const newValue = runEffect() as T;
    callback(newValue, oldValue);
    oldValue = newValue;
  };

  const runEffect = effect(getter, {
    lazy: true,
    scheduler: job,
  }) as ReactiveEffect<T>;

  if (options?.immediate) {
    job();
  } else {
    oldValue = runEffect() as T;
  }

  return () => {
    cleanup(runEffect);
  };
}

/**
 * Runs a function immediately and re-runs it whenever its reactive dependencies change.
 * Similar to `effect()` but returns a cleanup function instead of the effect.
 *
 * @param fn - The effect function to run
 * @returns A function to stop the effect
 *
 * @example
 * ```ts
 * const count = ref(0);
 *
 * const stop = watchEffect(() => {
 *   console.log('Count:', count.value);
 * });
 *
 * count.value++; // Logs: "Count: 1"
 * stop(); // Stop watching
 * count.value++; // No log
 * ```
 */
export function watchEffect(fn: () => void): () => void {
  const effectFn = effect(fn);
  return () => cleanup(effectFn);
}

let isFlushing = false;
const pendingJobs: Set<EffectFn> = new Set();

/**
 * Queues an effect to run in the next microtask, batching multiple updates.
 * Effects queued multiple times before flush will only run once.
 *
 * @param job - The effect function to queue
 *
 * @example
 * ```ts
 * const updateEffect = effect(() => render(), {
 *   scheduler: queueJob
 * });
 * ```
 */
export function queueJob(job: EffectFn): void {
  pendingJobs.add(job);
  if (!isFlushing) {
    isFlushing = true;
    Promise.resolve().then(flushJobs);
  }
}

function flushJobs(): void {
  pendingJobs.forEach(job => job());
  pendingJobs.clear();
  isFlushing = false;
}
