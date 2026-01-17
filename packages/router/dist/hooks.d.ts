/**
 * Router hooks for components.
 * @module
 */
import { ComputedRef, Ref } from '@bromium/core';
import { Router, RouteLocation } from './router.js';
/**
 * Returns the router instance.
 * Must be called within a component where a router has been created.
 *
 * @returns The router instance
 * @throws Error if called outside of router context
 *
 * @example
 * ```ts
 * function MyComponent() {
 *   const router = useRouter();
 *
 *   function handleClick() {
 *     router.push('/dashboard');
 *   }
 *
 *   return <button onClick={handleClick}>Go to Dashboard</button>;
 * }
 * ```
 */
export declare function useRouter(): Router;
/**
 * Returns a reactive reference to the current route location.
 *
 * @returns A ref containing the current RouteLocation
 *
 * @example
 * ```ts
 * function Breadcrumb() {
 *   const route = useRoute();
 *
 *   return <span>Current path: {route.value.path}</span>;
 * }
 * ```
 */
export declare function useRoute(): Ref<RouteLocation>;
/**
 * Returns a computed ref of the current route parameters.
 *
 * @returns A computed ref containing route params
 *
 * @example
 * ```ts
 * // For route /users/:id
 * function UserProfile() {
 *   const params = useParams();
 *
 *   return <div>User ID: {params.value.id}</div>;
 * }
 * ```
 */
export declare function useParams(): ComputedRef<Record<string, string>>;
/**
 * Returns a computed ref of the current query string parameters.
 *
 * @returns A computed ref containing query params
 *
 * @example
 * ```ts
 * // For URL /search?q=hello
 * function SearchResults() {
 *   const query = useQuery();
 *
 *   return <div>Searching for: {query.value.q}</div>;
 * }
 * ```
 */
export declare function useQuery(): ComputedRef<Record<string, string>>;
/**
 * Returns a computed ref of the merged metadata from all matched routes.
 *
 * @returns A computed ref containing route metadata
 *
 * @example
 * ```ts
 * function PageTitle() {
 *   const meta = useRouteMeta();
 *
 *   return <title>{meta.value.title || 'My App'}</title>;
 * }
 * ```
 */
export declare function useRouteMeta(): ComputedRef<Record<string, any>>;
/**
 * Returns navigation helper functions from the router.
 *
 * @returns An object with push, replace, back, forward, and go methods
 *
 * @example
 * ```ts
 * function Navigation() {
 *   const { push, back } = useNavigate();
 *
 *   return (
 *     <>
 *       <button onClick={back}>Back</button>
 *       <button onClick={() => push('/home')}>Home</button>
 *     </>
 *   );
 * }
 * ```
 */
export declare function useNavigate(): {
    push: (to: string | import("./router.js").NavigationTarget) => Promise<void>;
    replace: (to: string | import("./router.js").NavigationTarget) => Promise<void>;
    back: () => void;
    forward: () => void;
    go: (delta: number) => void;
};
/**
 * Returns a computed boolean indicating if the current route matches a path.
 *
 * @param path - A string path or RegExp to match against
 * @returns A computed ref that is true when the route matches
 *
 * @example
 * ```ts
 * function NavLink({ to, children }) {
 *   const isActive = useRouteMatch(to);
 *
 *   return (
 *     <a href={to} className={isActive.value ? 'active' : ''}>
 *       {children}
 *     </a>
 *   );
 * }
 * ```
 */
export declare function useRouteMatch(path: string | RegExp): ComputedRef<boolean>;
//# sourceMappingURL=hooks.d.ts.map