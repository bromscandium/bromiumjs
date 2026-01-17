/**
 * Component lifecycle hook system.
 * @module
 */
let currentInstance = null;
/**
 * Sets the currently rendering component instance.
 * Used internally by the renderer.
 *
 * @param instance - The component instance or null
 */
export function setCurrentInstance(instance) {
    currentInstance = instance;
}
/**
 * Returns the currently rendering component instance.
 * Used internally by hooks to access component state.
 *
 * @returns The current component instance or null if outside a component
 */
export function getCurrentInstance() {
    return currentInstance;
}
function registerLifecycleHook(type, fn) {
    if (!currentInstance) {
        if (import.meta.env?.DEV) {
            console.warn(`${type} hook called outside of component setup. ` +
                `Lifecycle hooks can only be used inside a component function.`);
        }
        return;
    }
    currentInstance[type].push(fn);
}
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
export function onMounted(fn) {
    registerLifecycleHook('mounted', fn);
}
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
export function onUnmounted(fn) {
    registerLifecycleHook('unmounted', fn);
}
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
export function onUpdated(fn) {
    registerLifecycleHook('updated', fn);
}
/**
 * Invokes an array of lifecycle hook callbacks with error handling.
 * Used internally by the renderer.
 *
 * @param hooks - Array of callback functions to invoke
 * @param errorContext - Description of the hook type for error messages
 */
export function invokeLifecycleHooks(hooks, errorContext) {
    hooks.forEach(hook => {
        try {
            hook();
        }
        catch (error) {
            console.error(`Error in ${errorContext || 'lifecycle hook'}:`, error);
        }
    });
}
//# sourceMappingURL=lifecycle.js.map