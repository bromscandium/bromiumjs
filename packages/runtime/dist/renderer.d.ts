/**
 * DOM Renderer with virtual DOM reconciliation and diffing.
 * @module
 */
import { VNode, ComponentFunction } from './vnode.js';
/**
 * Renders a virtual DOM tree into a container element.
 * Handles mounting, updating, and unmounting based on the previous state.
 *
 * @param vnode - The virtual node to render, or null to unmount
 * @param container - The DOM element to render into
 *
 * @example
 * ```ts
 * const vnode = h('div', { className: 'app' }, 'Hello');
 * render(vnode, document.getElementById('root')!);
 *
 * // Update
 * render(h('div', { className: 'app' }, 'Updated'), container);
 *
 * // Unmount
 * render(null, container);
 * ```
 */
export declare function render(vnode: VNode | null, container: Element): void;
/**
 * Configuration options for creating a Bromium application.
 */
export interface AppConfig {
    /** Path to the favicon image */
    favicon?: string;
}
/**
 * Creates a new Bromium application instance.
 *
 * @param rootComponent - The root component function to render
 * @param config - Optional application configuration
 * @returns An app instance with mount and unmount methods
 *
 * @example
 * ```ts
 * function App() {
 *   return <div>Hello, Bromium!</div>;
 * }
 *
 * const app = createApp(App, { favicon: '/icon.png' });
 * app.mount('#app');
 *
 * // Later: app.unmount();
 * ```
 */
export declare function createApp(rootComponent: ComponentFunction, config?: AppConfig): {
    /**
     * Mounts the application to a DOM element.
     *
     * @param selector - A CSS selector string or DOM Element to mount to
     * @returns The app instance for chaining
     */
    mount(selector: string | Element): /*elided*/ any;
    /**
     * Unmounts the application and cleans up resources.
     */
    unmount(): void;
};
//# sourceMappingURL=renderer.d.ts.map