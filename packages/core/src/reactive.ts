/**
 * Proxy-based reactivity system for deep reactive state management.
 * @module
 */

import { track, trigger } from './dep.js';

const reactiveMap = new WeakMap<object, object>();
const rawMap = new WeakMap<object, object>();

/**
 * Internal flags used to identify reactive objects.
 */
export const ReactiveFlags = {
  IS_REACTIVE: '__b_isReactive',
  RAW: '__b_raw',
} as const;

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
export function reactive<T extends object>(target: T): T {
  if (reactiveMap.has(target)) {
    return reactiveMap.get(target) as T;
  }

  if ((target as any)[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === ReactiveFlags.IS_REACTIVE) {
        return true;
      }
      if (key === ReactiveFlags.RAW) {
        return target;
      }

      const result = Reflect.get(target, key, receiver);

      track(target, key);

      if (typeof result === 'object' && result !== null) {
        return reactive(result);
      }

      return result;
    },

    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver);

      const newValue = (value as any)?.[ReactiveFlags.RAW] || value;

      const result = Reflect.set(target, key, newValue, receiver);

      if (!Object.is(oldValue, newValue)) {
        trigger(target, key);
      }

      return result;
    },

    deleteProperty(target, key) {
      const hadKey = Reflect.has(target, key);
      const result = Reflect.deleteProperty(target, key);

      if (hadKey && result) {
        trigger(target, key);
      }

      return result;
    },

    has(target, key) {
      track(target, key);
      return Reflect.has(target, key);
    },

    ownKeys(target) {
      track(target, Symbol('iterate'));
      return Reflect.ownKeys(target);
    },
  });

  reactiveMap.set(target, proxy);
  rawMap.set(proxy, target);

  return proxy as T;
}

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
export function isReactive(value: unknown): boolean {
  return !!(value && (value as any)[ReactiveFlags.IS_REACTIVE]);
}

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
export function toRaw<T>(observed: T): T {
  const raw = (observed as any)?.[ReactiveFlags.RAW];
  return raw ? toRaw(raw) : observed;
}

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
export function markRaw<T extends object>(value: T): T {
  Object.defineProperty(value, ReactiveFlags.IS_REACTIVE, {
    configurable: true,
    enumerable: false,
    value: false,
  });
  return value;
}
