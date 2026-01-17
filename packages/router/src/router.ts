/**
 * Router implementation with file-based routing support.
 * @module
 */

import { ref, Ref } from '@bromscandium/core';

/**
 * A route configuration object.
 */
export interface Route {
  /** The path pattern to match (supports `:param` and `[param]` syntax) */
  path: string;
  /** The component to render, can be async for lazy loading */
  component: () => Promise<{ default: any }> | { default: any };
  /** Optional layout component to wrap the page */
  layout?: () => Promise<{ default: any }> | { default: any };
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
export type NavigationGuard = (
  to: RouteLocation,
  from: RouteLocation
) => boolean | string | NavigationTarget | Promise<boolean | string | NavigationTarget>;

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

let currentRouter: Router | null = null;

/**
 * Sets the current router instance for global access.
 *
 * @param router - The router instance or null to clear
 */
export function setRouter(router: Router | null): void {
  currentRouter = router;
}

/**
 * Gets the current router instance.
 *
 * @returns The current router or null if not set
 */
export function getRouter(): Router | null {
  return currentRouter;
}

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
export function createRouter(options: RouterOptions): Router {
  const { routes, base = '' } = options;

  const currentRoute = ref<RouteLocation>(createEmptyLocation());
  const beforeGuards: NavigationGuard[] = [];
  const afterHooks: NavigationHook[] = [];
  let isReady = false;
  let readyResolve: ((value?: void | PromiseLike<void>) => void) | null = null;
  const readyPromise = new Promise<void>((resolve) => {
    readyResolve = resolve;
  });

  function createEmptyLocation(): RouteLocation {
    return {
      path: '/',
      params: {},
      query: {},
      hash: '',
      matched: [],
      fullPath: '/',
      meta: {},
    };
  }

  function parseQuery(search: string): Record<string, string> {
    const query: Record<string, string> = {};
    if (!search) return query;

    const searchParams = new URLSearchParams(search);
    searchParams.forEach((value, key) => {
      query[key] = value;
    });

    return query;
  }

  function stringifyQuery(query: Record<string, string>): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value != null && value !== '') {
        params.set(key, value);
      }
    }
    const str = params.toString();
    return str ? `?${str}` : '';
  }

  function matchRoute(
    path: string,
    routes: Route[],
    basePath = ''
  ): MatchedRoute[] {
    const matched: MatchedRoute[] = [];
    const segments = path.split('/').filter(Boolean);

    function match(routes: Route[], segmentIndex: number, parentPath: string): boolean {
      for (const route of routes) {
        const routePath = route.path.startsWith('/')
          ? route.path
          : `${parentPath}/${route.path}`.replace(/\/+/g, '/');

        const routeSegments = routePath.split('/').filter(Boolean);
        const params: Record<string, string> = {};
        let matches = true;
        let i = 0;

        for (const routeSeg of routeSegments) {
          const pathSeg = segments[segmentIndex + i];

          if (routeSeg.startsWith(':')) {
            const paramName = routeSeg.slice(1);
            if (pathSeg) {
              params[paramName] = decodeURIComponent(pathSeg);
            } else {
              matches = false;
              break;
            }
          } else if (routeSeg.startsWith('[') && routeSeg.endsWith(']')) {
            const paramName = routeSeg.slice(1, -1).replace('...', '');
            if (routeSeg.startsWith('[...')) {
              const remaining = segments.slice(segmentIndex + i);
              params[paramName] = remaining.join('/');
              i += remaining.length;
              break;
            } else if (pathSeg) {
              params[paramName] = decodeURIComponent(pathSeg);
            } else {
              matches = false;
              break;
            }
          } else if (routeSeg !== pathSeg) {
            matches = false;
            break;
          }
          i++;
        }

        const totalSegments = segmentIndex + i;
        const isExactMatch = totalSegments === segments.length;
        const hasChildren = route.children && route.children.length > 0;

        if (matches && (isExactMatch || hasChildren)) {
          matched.push({
            route,
            params,
            path: routePath,
          });

          if (hasChildren && !isExactMatch) {
            match(route.children!, totalSegments, routePath);
          }

          return true;
        }
      }

      return false;
    }

    match(routes, 0, basePath);
    return matched;
  }

  function parseLocation(location: Location): RouteLocation {
    const urlPath = location.pathname;
    const path = urlPath.replace(base, '') || '/';
    const query = parseQuery(location.search);
    const hash = location.hash.slice(1);
    const matched = matchRoute(path, routes, '');

    const params: Record<string, string> = {};
    const meta: Record<string, any> = {};

    matched.forEach(m => {
      Object.assign(params, m.params);
      Object.assign(meta, m.route.meta || {});
    });

    const fullPath = path + stringifyQuery(query) + (hash ? `#${hash}` : '');
    const name = matched[matched.length - 1]?.route.name;

    return { path, params, query, hash, matched, fullPath, name, meta };
  }

  function resolveTarget(target: string | NavigationTarget): string {
    if (typeof target === 'string') {
      return target;
    }

    let path = target.path || '/';

    if (target.name) {
      const findRoute = (routes: Route[], name: string): Route | null => {
        for (const route of routes) {
          if (route.name === name) return route;
          if (route.children) {
            const found = findRoute(route.children, name);
            if (found) return found;
          }
        }
        return null;
      };

      const route = findRoute(routes, target.name);
      if (route) {
        path = route.path;
        if (target.params) {
          for (const [key, value] of Object.entries(target.params)) {
            path = path.replace(`:${key}`, encodeURIComponent(value));
            path = path.replace(`[${key}]`, encodeURIComponent(value));
          }
        }
      }
    }

    if (target.query) {
      path += stringifyQuery(target.query);
    }

    if (target.hash) {
      path += target.hash.startsWith('#') ? target.hash : `#${target.hash}`;
    }

    return path;
  }

  async function navigate(
    to: string | NavigationTarget,
    replace = false
  ): Promise<void> {
    const resolvedPath = resolveTarget(to);
    const url = new URL(resolvedPath, window.location.origin);

    if (base && !url.pathname.startsWith(base)) {
      url.pathname = base + url.pathname;
    }

    const newLocation = parseLocation({
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
    } as Location);

    const from = currentRoute.value;

    for (const guard of beforeGuards) {
      const result = await guard(newLocation, from);

      if (result === false) {
        return;
      }

      if (typeof result === 'string' || (typeof result === 'object' && result !== null)) {
        await navigate(result as string | NavigationTarget, replace);
        return;
      }
    }

    if (replace) {
      window.history.replaceState(null, '', url.href);
    } else {
      window.history.pushState(null, '', url.href);
    }

    currentRoute.value = newLocation;

    afterHooks.forEach(hook => hook(newLocation, from));
  }

  window.addEventListener('popstate', () => {
    const newLocation = parseLocation(window.location);
    const from = currentRoute.value;

    currentRoute.value = newLocation;

    afterHooks.forEach(hook => hook(newLocation, from));
  });

  const router: Router = {
    currentRoute,
    routes,
    base,

    push: (to) => navigate(to, false),
    replace: (to) => navigate(to, true),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    go: (delta) => window.history.go(delta),

    beforeEach(guard) {
      beforeGuards.push(guard);
      return () => {
        const index = beforeGuards.indexOf(guard);
        if (index > -1) beforeGuards.splice(index, 1);
      };
    },

    afterEach(hook) {
      afterHooks.push(hook);
      return () => {
        const index = afterHooks.indexOf(hook);
        if (index > -1) afterHooks.splice(index, 1);
      };
    },

    isReady() {
      if (isReady) return Promise.resolve();
      return readyPromise;
    },
  };

  currentRoute.value = parseLocation(window.location);
  isReady = true;
  (readyResolve as (() => void) | null)?.()

  setRouter(router);

  return router;
}
