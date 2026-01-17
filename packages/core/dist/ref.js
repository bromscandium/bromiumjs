/**
 * Ref implementation for wrapping primitive and object values in reactive containers.
 * @module
 */
var _a, _b;
import { track, trigger, getActiveEffect } from './dep.js';
import { reactive, toRaw } from './reactive.js';
/** Internal flag used to identify ref objects */
export const RefFlag = '__b_isRef';
class RefImpl {
    constructor(value) {
        this[_a] = true;
        this._rawValue = toRaw(value);
        this._value = toReactive(value);
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }
    set value(newValue) {
        const rawNewValue = toRaw(newValue);
        if (!Object.is(rawNewValue, this._rawValue)) {
            this._rawValue = rawNewValue;
            this._value = toReactive(newValue);
            triggerRefValue(this);
        }
    }
}
_a = RefFlag;
function toReactive(value) {
    return typeof value === 'object' && value !== null
        ? reactive(value)
        : value;
}
function trackRefValue(ref) {
    if (getActiveEffect()) {
        track(ref, 'value');
    }
}
function triggerRefValue(ref) {
    trigger(ref, 'value');
}
export function ref(value) {
    if (isRef(value)) {
        return value;
    }
    return new RefImpl(value);
}
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
export function isRef(value) {
    return !!(value && value[RefFlag] === true);
}
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
export function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
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
export function toRef(object, key) {
    const val = object[key];
    if (isRef(val)) {
        return val;
    }
    return {
        get value() {
            return object[key];
        },
        set value(newValue) {
            object[key] = newValue;
        },
        [RefFlag]: true,
    };
}
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
export function toRefs(object) {
    const result = {};
    for (const key in object) {
        result[key] = toRef(object, key);
    }
    return result;
}
class ShallowRefImpl {
    constructor(value) {
        this[_b] = true;
        this._value = value;
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }
    set value(newValue) {
        if (!Object.is(newValue, this._value)) {
            this._value = newValue;
            triggerRefValue(this);
        }
    }
}
_b = RefFlag;
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
export function shallowRef(value) {
    return new ShallowRefImpl(value);
}
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
export function triggerRef(ref) {
    triggerRefValue(ref);
}
//# sourceMappingURL=ref.js.map