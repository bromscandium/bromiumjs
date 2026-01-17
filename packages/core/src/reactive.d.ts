/**
 * Proxy-based reactivity system for deep reactive state management.
 * @module
 */
/**
 * Internal flags used to identify reactive objects.
 */
export declare const ReactiveFlags: {
    readonly IS_REACTIVE: "__b_isReactive";
    readonly RAW: "__b_raw";
};
/**
 * Creates a deeply reactive proxy of an object.
 * Changes to the object or its nested properties will automatically trigger effects.
 *
 * @param target - The object to make reactive
 * @returns A reactive proxy of the target object
 *
 * @example
 * ```ts
 * const state = reactive({ count: 0, nested: { value: 1 } });
 * state.count++; // Triggers effects tracking 'count'
 * state.nested.value++; // Triggers effects tracking nested 'value'
 * ```
 */
export declare function reactive<T extends object>(target: T): T;
/**
 * Checks if a value is a reactive proxy created by `reactive()`.
 *
 * @param value - The value to check
 * @returns True if the value is a reactive proxy
 *
 * @example
 * ```ts
 * const state = reactive({ count: 0 });
 * isReactive(state); // true
 * isReactive({ count: 0 }); // false
 * ```
 */
export declare function isReactive(value: unknown): boolean;
/**
 * Returns the raw, non-reactive version of a reactive object.
 * Useful when you need to read values without triggering dependency tracking.
 *
 * @param observed - The reactive object to unwrap
 * @returns The original non-reactive object
 *
 * @example
 * ```ts
 * const state = reactive({ count: 0 });
 * const raw = toRaw(state);
 * raw === state; // false
 * isReactive(raw); // false
 * ```
 */
export declare function toRaw<T>(observed: T): T;
/**
 * Marks an object so it will never be converted to a reactive proxy.
 * Useful for values that should not be made reactive, like third-party class instances.
 *
 * @param value - The object to mark as non-reactive
 * @returns The same object, marked as raw
 *
 * @example
 * ```ts
 * const obj = markRaw({ count: 0 });
 * const state = reactive({ data: obj });
 * isReactive(state.data); // false - obj was marked raw
 * ```
 */
export declare function markRaw<T extends object>(value: T): T;
//# sourceMappingURL=reactive.d.ts.map