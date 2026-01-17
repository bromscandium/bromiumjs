/**
 * React-style hooks for state persistence across re-renders.
 * @module
 */
import { Ref } from '@bromium/core';
/**
 * Creates a reactive state variable that persists across component re-renders.
 * Similar to React's useState but returns a Ref for reactivity integration.
 *
 * @param initialValue - The initial value, or a function that returns the initial value
 * @returns A reactive ref containing the state value
 *
 * @example
 * ```ts
 * function Counter() {
 *   const count = useState(0);
 *
 *   return (
 *     <button onClick={() => count.value++}>
 *       Count: {count.value}
 *     </button>
 *   );
 * }
 *
 * // With lazy initialization
 * const expensive = useState(() => computeExpensiveValue());
 * ```
 */
export declare function useState<T>(initialValue: T | (() => T)): Ref<T>;
/**
 * Creates a mutable ref object that persists across re-renders without triggering updates.
 * Useful for storing DOM references or mutable values that don't affect rendering.
 *
 * @param initialValue - The initial value for the ref
 * @returns An object with a `current` property containing the value
 *
 * @example
 * ```ts
 * function TextInput() {
 *   const inputRef = useRef<HTMLInputElement>(null);
 *
 *   onMounted(() => {
 *     inputRef.current?.focus();
 *   });
 *
 *   return <input ref={inputRef} />;
 * }
 *
 * // Storing mutable values
 * const renderCount = useRef(0);
 * renderCount.current++; // Doesn't trigger re-render
 * ```
 */
export declare function useRef<T>(initialValue: T): {
    current: T;
};
/**
 * Memoizes an expensive computation, recalculating only when dependencies change.
 *
 * @param factory - A function that computes and returns the memoized value
 * @param deps - An array of dependencies that trigger recalculation when changed
 * @returns The memoized value
 *
 * @example
 * ```ts
 * function FilteredList({ items, filter }) {
 *   const filtered = useMemo(
 *     () => items.filter(item => item.includes(filter)),
 *     [items, filter]
 *   );
 *
 *   return <ul>{filtered.map(item => <li>{item}</li>)}</ul>;
 * }
 * ```
 */
export declare function useMemo<T>(factory: () => T, deps: any[]): T;
/**
 * Memoizes a callback function, returning the same reference until dependencies change.
 * Useful for passing stable callbacks to child components to prevent unnecessary re-renders.
 *
 * @param callback - The callback function to memoize
 * @param deps - An array of dependencies that trigger creating a new callback when changed
 * @returns The memoized callback function
 *
 * @example
 * ```ts
 * function Parent() {
 *   const [count, setCount] = useState(0);
 *
 *   const handleClick = useCallback(() => {
 *     console.log('Clicked with count:', count);
 *   }, [count]);
 *
 *   return <Child onClick={handleClick} />;
 * }
 * ```
 */
export declare function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
//# sourceMappingURL=hooks.d.ts.map