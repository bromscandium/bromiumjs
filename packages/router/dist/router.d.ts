/**
 * Router implementation with file-based routing support.
 * @module
 */
import { Ref } from '@bromium/core';
/**
 * A route configuration object.
 */
export interface Route {
    /** The path pattern to match (supports `:param` and `[param]` syntax) */
    path: string;
    /** The component to render, can be async for lazy loading */
    component: () => Promise<{
        default: any;
    }> | {
        default: any;
    };
    /** Optional layout component to wrap the page */
    layout?: () => Promise<{
        default: any;
    }> | {
        default: any;
    };
    /** Child routes for nested routing */
    children?: Route[];
    /** Arbitrary metadata attached to the route */
    meta?: Record<string, any>;
    /** Named route identifier for programmatic navigation */
    name?: string;
}
/**
 * The current location state.
 */
export interface RouteLocation {
    /** The current path without query or hash */
    path: string;
    /** Dynamic route parameters extracted from the path */
    params: Record<string, string>;
    /** Query string parameters */
    query: Record<string, string>;
    /** Hash fragment (without #) */
    hash: string;
    /** All matched route records for the current location */
    matched: MatchedRoute[];
    /** Full path including query and hash */
    fullPath: string;
    /** Name of the matched route if defined */
    name?: string;
    /** Merged metadata from all matched routes */
    meta: Record<string, any>;
}
/**
 * A matched route record with extracted parameters.
 */
export interface MatchedRoute {
    /** The route configuration */
    route: Route;
    /** Parameters extracted from the path */
    params: Record<string, string>;
    /** The resolved path for this route */
    path: string;
}
/**
 * The router instance providing navigation and route state.
 */
export interface Router {
    /** Reactive reference to the current route location */
    currentRoute: Ref<RouteLocation>;
    /** Navigate to a new location, adding to history */
    push(to: string | NavigationTarget): Promise<void>;
    /** Navigate to a new location, replacing current history entry */
    replace(to: string | NavigationTarget): Promise<void>;
    /** Navigate back in history */
    back(): void;
    /** Navigate forward in history */
    forward(): void;
    /** Navigate by a relative history position */
    go(delta: number): void;
    /** Register a navigation guard called before navigation */
    beforeEach(guard: NavigationGuard): () => void;
    /** Register a hook called after navigation completes */
    afterEach(hook: NavigationHook): () => void;
    /** Returns a promise that resolves when router is ready */
    isReady(): Promise<void>;
    /** The configured routes */
    routes: Route[];
    /** The base path for all routes */
    base: string;
}
/**
 * A navigation target for programmatic navigation.
 */
export interface NavigationTarget {
    /** Target path */
    path?: string;
    /** Named route to navigate to */
    name?: string;
    /** Route parameters for dynamic segments */
    params?: Record<string, string>;
    /** Query parameters */
    query?: Record<string, string>;
    /** Hash fragment */
    hash?: string;
}
/**
 * A navigation guard function that can block or redirect navigation.
 * Return false to cancel, string/NavigationTarget to redirect, or true to proceed.
 */
export type NavigationGuard = (to: RouteLocation, from: RouteLocation) => boolean | string | NavigationTarget | Promise<boolean | string | NavigationTarget>;
/**
 * A hook called after navigation completes.
 */
export type NavigationHook = (to: RouteLocation, from: RouteLocation) => void;
interface RouterOptions {
    /** Route configurations */
    routes: Route[];
    /** Base path prepended to all routes */
    base?: string;
}
/**
 * Sets the current router instance for global access.
 *
 * @param router - The router instance or null to clear
 */
export declare function setRouter(router: Router | null): void;
/**
 * Gets the current router instance.
 *
 * @returns The current router or null if not set
 */
export declare function getRouter(): Router | null;
/**
 * Creates a new router instance with the given configuration.
 *
 * @param options - Router configuration including routes and optional base path
 * @returns A configured router instance
 *
 * @example
 * ```ts
 * const router = createRouter({
 *   base: '/app',
 *   routes: [
 *     { path: '/', component: () => import('./pages/Home') },
 *     { path: '/users/:id', component: () => import('./pages/User') },
 *   ]
 * });
 *
 * // Use navigation guards
 * router.beforeEach((to, from) => {
 *   if (!isAuthenticated && to.path !== '/login') {
 *     return '/login';
 *   }
 *   return true;
 * });
 * ```
 */
export declare function createRouter(options: RouterOptions): Router;
export {};
//# sourceMappingURL=router.d.ts.map