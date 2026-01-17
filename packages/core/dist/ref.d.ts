/**
 * Ref implementation for wrapping primitive and object values in reactive containers.
 * @module
 */
/** Internal flag used to identify ref objects */
export declare const RefFlag = "__b_isRef";
/**
 * A reactive reference that wraps a value and tracks access to its `.value` property.
 */
export interface Ref<T = any> {
    value: T;
    readonly [RefFlag]: true;
}
/**
 * A computed ref with a read-only value that is derived from other reactive state.
 */
export interface ComputedRef<T = any> extends Ref<T> {
    readonly value: T;
}
/**
 * Creates a reactive reference for a value.
 * Object values are automatically made deeply reactive.
 *
 * @param value - The initial value for the ref
 * @returns A reactive ref containing the value
 *
 * @example
 * ```ts
 * const count = ref(0);
 * console.log(count.value); // 0
 * count.value++; // Triggers effects
 *
 * const obj = ref({ nested: 1 });
 * obj.value.nested++; // Also triggers effects (deep reactivity)
 * ```
 */
export declare function ref<T>(value: T): Ref<T>;
export declare function ref<T = any>(): Ref<T | undefined>;
/**
 * Checks if a value is a ref created by `ref()` or `computed()`.
 *
 * @param value - The value to check
 * @returns True if the value is a ref
 *
 * @example
 * ```ts
 * isRef(ref(0)); // true
 * isRef(0); // false
 * isRef(computed(() => 1)); // true
 * ```
 */
export declare function isRef<T>(value: Ref<T> | unknown): value is Ref<T>;
/**
 * Unwraps a ref to get its inner value. Returns the value directly if not a ref.
 *
 * @param ref - A ref or plain value to unwrap
 * @returns The unwrapped value
 *
 * @example
 * ```ts
 * unref(ref(1)); // 1
 * unref(1); // 1
 * ```
 */
export declare function unref<T>(ref: T | Ref<T>): T;
/**
 * Creates a ref that syncs with a property of a reactive object.
 * The ref stays connected to the source object.
 *
 * @param object - The source reactive object
 * @param key - The property key to create a ref for
 * @returns A ref linked to the specified property
 *
 * @example
 * ```ts
 * const state = reactive({ count: 0 });
 * const countRef = toRef(state, 'count');
 * countRef.value++; // Also updates state.count
 * ```
 */
export declare function toRef<T extends object, K extends keyof T>(object: T, key: K): Ref<T[K]>;
/**
 * Converts all properties of a reactive object into refs.
 * Each ref is linked to the corresponding property on the source object.
 *
 * @param object - The source reactive object
 * @returns An object with the same keys, where each value is a ref
 *
 * @example
 * ```ts
 * const state = reactive({ count: 0, name: 'test' });
 * const { count, name } = toRefs(state);
 * count.value++; // Updates state.count
 * ```
 */
export declare function toRefs<T extends object>(object: T): {
    [K in keyof T]: Ref<T[K]>;
};
/**
 * A shallow ref type (same interface as Ref but without deep reactivity).
 */
export type ShallowRef<T = any> = Ref<T>;
/**
 * Creates a ref that does not make its value deeply reactive.
 * Only reassigning `.value` will trigger effects, not mutations to nested properties.
 *
 * @param value - The initial value for the shallow ref
 * @returns A shallow ref containing the value
 *
 * @example
 * ```ts
 * const state = shallowRef({ nested: 0 });
 * state.value.nested++; // Does NOT trigger effects
 * state.value = { nested: 1 }; // Triggers effects
 * ```
 */
export declare function shallowRef<T>(value: T): ShallowRef<T>;
/**
 * Manually triggers effects that depend on a ref.
 * Useful after mutating the inner value of a shallow ref.
 *
 * @param ref - The ref to trigger
 *
 * @example
 * ```ts
 * const state = shallowRef({ count: 0 });
 * state.value.count++; // No automatic trigger
 * triggerRef(state); // Manually trigger effects
 * ```
 */
export declare function triggerRef(ref: Ref): void;
//# sourceMappingURL=ref.d.ts.map