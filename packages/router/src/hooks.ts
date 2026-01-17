/**
 * Router hooks for components.
 * @module
 */

import { computed, ComputedRef, Ref } from '@bromium/core';
import { getRouter, Router, RouteLocation } from './router.js';

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
export function useRouter(): Router {
  const router = getRouter();
  if (!router) {
    throw new Error(
      'useRouter() called outside of router context. ' +
      'Make sure you have created a router with createRouter() and mounted it.'
    );
  }
  return router;
}

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
export function useRoute(): Ref<RouteLocation> {
  const router = useRouter();
  return router.currentRoute;
}

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
export function useParams(): ComputedRef<Record<string, string>> {
  const route = useRoute();
  return computed(() => route.value.params);
}

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
export function useQuery(): ComputedRef<Record<string, string>> {
  const route = useRoute();
  return computed(() => route.value.query);
}

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
export function useRouteMeta(): ComputedRef<Record<string, any>> {
  const route = useRoute();
  return computed(() => route.value.meta);
}

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
export function useNavigate() {
  const router = useRouter();

  return {
    push: router.push,
    replace: router.replace,
    back: router.back,
    forward: router.forward,
    go: router.go,
  };
}

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
export function useRouteMatch(path: string | RegExp): ComputedRef<boolean> {
  const route = useRoute();

  return computed(() => {
    const currentPath = route.value.path;

    if (typeof path === 'string') {
      return currentPath === path || currentPath.startsWith(path + '/');
    }

    return path.test(currentPath);
  });
}
