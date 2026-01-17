/**
 * Component lifecycle hook system.
 * @module
 */
import { ComponentInstance } from './vnode.js';
/**
 * Sets the currently rendering component instance.
 * Used internally by the renderer.
 *
 * @param instance - The component instance or null
 */
export declare function setCurrentInstance(instance: ComponentInstance | null): void;
/**
 * Returns the currently rendering component instance.
 * Used internally by hooks to access component state.
 *
 * @returns The current component instance or null if outside a component
 */
export declare function getCurrentInstance(): ComponentInstance | null;
/**
 * Registers a callback to be invoked after the component is mounted to the DOM.
 * The callback runs after the initial render and DOM insertion.
 *
 * @param fn - The callback function to invoke on mount
 *
 * @example
 * ```ts
 * function MyComponent() {
 *   onMounted(() => {
 *     console.log('Component mounted!');
 *     // DOM is available here
 *   });
 *
 *   return <div>Hello</div>;
 * }
 * ```
 */
export declare function onMounted(fn: () => void): void;
/**
 * Registers a callback to be invoked before the component is unmounted.
 * Use this to clean up side effects like timers, subscriptions, or event listeners.
 *
 * @param fn - The callback function to invoke on unmount
 *
 * @example
 * ```ts
 * function MyComponent() {
 *   const timer = setInterval(() => {}, 1000);
 *
 *   onUnmounted(() => {
 *     clearInterval(timer);
 *   });
 *
 *   return <div>Hello</div>;
 * }
 * ```
 */
export declare function onUnmounted(fn: () => void): void;
/**
 * Registers a callback to be invoked after the component updates.
 * The callback runs after each re-render caused by reactive state changes.
 *
 * @param fn - The callback function to invoke after updates
 *
 * @example
 * ```ts
 * function MyComponent() {
 *   const count = ref(0);
 *
 *   onUpdated(() => {
 *     console.log('Component updated, count is now:', count.value);
 *   });
 *
 *   return <button onClick={() => count.value++}>{count.value}</button>;
 * }
 * ```
 */
export declare function onUpdated(fn: () => void): void;
/**
 * Invokes an array of lifecycle hook callbacks with error handling.
 * Used internally by the renderer.
 *
 * @param hooks - Array of callback functions to invoke
 * @param errorContext - Description of the hook type for error messages
 */
export declare function invokeLifecycleHooks(hooks: Array<() => void>, errorContext?: string): void;
//# sourceMappingURL=lifecycle.d.ts.map