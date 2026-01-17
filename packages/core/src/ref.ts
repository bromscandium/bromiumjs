/**
 * Ref implementation for wrapping primitive and object values in reactive containers.
 * @module
 */

import { track, trigger, getActiveEffect } from './dep.js';
import { reactive, toRaw } from './reactive.js';

/** Internal flag used to identify ref objects */
export const RefFlag = '__b_isRef';

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

class RefImpl<T> {
  private _value: T;
  private _rawValue: T;
  public readonly [RefFlag] = true;

  constructor(value: T) {
    this._rawValue = toRaw(value) as T;
    this._value = toReactive(value);
  }

  get value(): T {
    trackRefValue(this);
    return this._value;
  }

  set value(newValue: T) {
    const rawNewValue = toRaw(newValue) as T;
    if (!Object.is(rawNewValue, this._rawValue)) {
      this._rawValue = rawNewValue;
      this._value = toReactive(newValue);
      triggerRefValue(this);
    }
  }
}

function toReactive<T>(value: T): T {
  return typeof value === 'object' && value !== null
    ? reactive(value as object) as T
    : value;
}

function trackRefValue(ref: any): void {
  if (getActiveEffect()) {
    track(ref, 'value');
  }
}

function triggerRefValue(ref: any): void {
  trigger(ref, 'value');
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
export function ref<T>(value: T): Ref<T>;
export function ref<T = any>(): Ref<T | undefined>;
export function ref<T>(value?: T): Ref<T> {
  if (isRef(value)) {
    return value as Ref<T>;
  }
  return new RefImpl(value) as Ref<T>;
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
export function isRef<T>(value: Ref<T> | unknown): value is Ref<T> {
  return !!(value && (value as any)[RefFlag] === true);
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
export function unref<T>(ref: T | Ref<T>): T {
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
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): Ref<T[K]> {
  const val = object[key];
  if (isRef(val)) {
    return val as Ref<T[K]>;
  }

  return {
    get value() {
      return object[key];
    },
    set value(newValue) {
      object[key] = newValue;
    },
    [RefFlag]: true,
  } as Ref<T[K]>;
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
export function toRefs<T extends object>(object: T): { [K in keyof T]: Ref<T[K]> } {
  const result: any = {};
  for (const key in object) {
    result[key] = toRef(object, key);
  }
  return result;
}

/**
 * A shallow ref type (same interface as Ref but without deep reactivity).
 */
export type ShallowRef<T = any> = Ref<T>;

class ShallowRefImpl<T> {
  private _value: T;
  public readonly [RefFlag] = true;

  constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    trackRefValue(this);
    return this._value;
  }

  set value(newValue: T) {
    if (!Object.is(newValue, this._value)) {
      this._value = newValue;
      triggerRefValue(this);
    }
  }
}

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
export function shallowRef<T>(value: T): ShallowRef<T> {
  return new ShallowRefImpl(value) as ShallowRef<T>;
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
export function triggerRef(ref: Ref): void {
  triggerRefValue(ref);
}
