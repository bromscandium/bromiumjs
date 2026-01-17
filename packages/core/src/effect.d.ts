/**
 * Effect system for reactive side effects, computed values, and watchers.
 * @module
 */
import { EffectFn, EffectOptions } from './dep.js';
import { Ref, ComputedRef } from './ref.js';
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
export declare function effect(fn: () => void, options?: EffectOptions): EffectFn;
export declare function effect<T>(fn: () => T, options?: EffectOptions): ReactiveEffect<T>;
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
export declare function computed<T>(getter: () => T): ComputedRef<T>;
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
export declare function watch<T>(source: WatchSource<T>, callback: WatchCallback<T>, options?: WatchOptions): () => void;
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
export declare function watchEffect(fn: () => void): () => void;
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
export declare function queueJob(job: EffectFn): void;
export {};
//# sourceMappingURL=effect.d.ts.map