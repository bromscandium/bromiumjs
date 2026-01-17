/**
 * Effect system for reactive side effects, computed values, and watchers.
 * @module
 */
var _a;
import { cleanup, pushEffect, popEffect, track, trigger, getActiveEffect, } from './dep.js';
import { isRef, RefFlag } from './ref.js';
function trackComputed(computed) {
    if (getActiveEffect()) {
        track(computed, 'value');
    }
}
function triggerComputed(computed) {
    trigger(computed, 'value');
}
export function effect(fn, options) {
    const effectFn = () => {
        cleanup(effectFn);
        pushEffect(effectFn);
        try {
            return fn();
        }
        finally {
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
class ComputedRefImpl {
    constructor(getter) {
        this._dirty = true;
        this[_a] = true;
        this._effect = effect(getter, {
            lazy: true,
            scheduler: () => {
                if (!this._dirty) {
                    this._dirty = true;
                    triggerComputed(this);
                }
            },
        });
    }
    get value() {
        trackComputed(this);
        if (this._dirty) {
            this._value = this._effect();
            this._dirty = false;
        }
        return this._value;
    }
}
_a = RefFlag;
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
export function computed(getter) {
    return new ComputedRefImpl(getter);
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
export function watch(source, callback, options) {
    let getter;
    if (isRef(source)) {
        getter = () => source.value;
    }
    else if (typeof source === 'function') {
        getter = source;
    }
    else {
        getter = () => source;
    }
    let oldValue;
    const job = () => {
        const newValue = runEffect();
        callback(newValue, oldValue);
        oldValue = newValue;
    };
    const runEffect = effect(getter, {
        lazy: true,
        scheduler: job,
    });
    if (options?.immediate) {
        job();
    }
    else {
        oldValue = runEffect();
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
export function watchEffect(fn) {
    const effectFn = effect(fn);
    return () => cleanup(effectFn);
}
let isFlushing = false;
const pendingJobs = new Set();
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
export function queueJob(job) {
    pendingJobs.add(job);
    if (!isFlushing) {
        isFlushing = true;
        Promise.resolve().then(flushJobs);
    }
}
function flushJobs() {
    pendingJobs.forEach(job => job());
    pendingJobs.clear();
    isFlushing = false;
}
//# sourceMappingURL=effect.js.map