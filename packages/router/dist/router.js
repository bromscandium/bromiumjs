/**
 * Router implementation with file-based routing support.
 * @module
 */
import { ref } from '@bromium/core';
let currentRouter = null;
/**
 * Sets the current router instance for global access.
 *
 * @param router - The router instance or null to clear
 */
export function setRouter(router) {
    currentRouter = router;
}
/**
 * Gets the current router instance.
 *
 * @returns The current router or null if not set
 */
export function getRouter() {
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
export function createRouter(options) {
    const { routes, base = '' } = options;
    const currentRoute = ref(createEmptyLocation());
    const beforeGuards = [];
    const afterHooks = [];
    let isReady = false;
    let readyResolve = null;
    const readyPromise = new Promise((resolve) => {
        readyResolve = resolve;
    });
    function createEmptyLocation() {
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
    function parseQuery(search) {
        const query = {};
        if (!search)
            return query;
        const searchParams = new URLSearchParams(search);
        searchParams.forEach((value, key) => {
            query[key] = value;
        });
        return query;
    }
    function stringifyQuery(query) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(query)) {
            if (value != null && value !== '') {
                params.set(key, value);
            }
        }
        const str = params.toString();
        return str ? `?${str}` : '';
    }
    function matchRoute(path, routes, basePath = '') {
        const matched = [];
        const segments = path.split('/').filter(Boolean);
        function match(routes, segmentIndex, parentPath) {
            for (const route of routes) {
                const routePath = route.path.startsWith('/')
                    ? route.path
                    : `${parentPath}/${route.path}`.replace(/\/+/g, '/');
                const routeSegments = routePath.split('/').filter(Boolean);
                const params = {};
                let matches = true;
                let i = 0;
                for (const routeSeg of routeSegments) {
                    const pathSeg = segments[segmentIndex + i];
                    if (routeSeg.startsWith(':')) {
                        const paramName = routeSeg.slice(1);
                        if (pathSeg) {
                            params[paramName] = decodeURIComponent(pathSeg);
                        }
                        else {
                            matches = false;
                            break;
                        }
                    }
                    else if (routeSeg.startsWith('[') && routeSeg.endsWith(']')) {
                        const paramName = routeSeg.slice(1, -1).replace('...', '');
                        if (routeSeg.startsWith('[...')) {
                            const remaining = segments.slice(segmentIndex + i);
                            params[paramName] = remaining.join('/');
                            i += remaining.length;
                            break;
                        }
                        else if (pathSeg) {
                            params[paramName] = decodeURIComponent(pathSeg);
                        }
                        else {
                            matches = false;
                            break;
                        }
                    }
                    else if (routeSeg !== pathSeg) {
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
                        match(route.children, totalSegments, routePath);
                    }
                    return true;
                }
            }
            return false;
        }
        match(routes, 0, basePath);
        return matched;
    }
    function parseLocation(location) {
        const urlPath = location.pathname;
        const path = urlPath.replace(base, '') || '/';
        const query = parseQuery(location.search);
        const hash = location.hash.slice(1);
        const matched = matchRoute(path, routes, '');
        const params = {};
        const meta = {};
        matched.forEach(m => {
            Object.assign(params, m.params);
            Object.assign(meta, m.route.meta || {});
        });
        const fullPath = path + stringifyQuery(query) + (hash ? `#${hash}` : '');
        const name = matched[matched.length - 1]?.route.name;
        return { path, params, query, hash, matched, fullPath, name, meta };
    }
    function resolveTarget(target) {
        if (typeof target === 'string') {
            return target;
        }
        let path = target.path || '/';
        if (target.name) {
            const findRoute = (routes, name) => {
                for (const route of routes) {
                    if (route.name === name)
                        return route;
                    if (route.children) {
                        const found = findRoute(route.children, name);
                        if (found)
                            return found;
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
    async function navigate(to, replace = false) {
        const resolvedPath = resolveTarget(to);
        const url = new URL(resolvedPath, window.location.origin);
        if (base && !url.pathname.startsWith(base)) {
            url.pathname = base + url.pathname;
        }
        const newLocation = parseLocation({
            pathname: url.pathname,
            search: url.search,
            hash: url.hash,
        });
        const from = currentRoute.value;
        for (const guard of beforeGuards) {
            const result = await guard(newLocation, from);
            if (result === false) {
                return;
            }
            if (typeof result === 'string' || (typeof result === 'object' && result !== null)) {
                await navigate(result, replace);
                return;
            }
        }
        if (replace) {
            window.history.replaceState(null, '', url.href);
        }
        else {
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
    const router = {
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
                if (index > -1)
                    beforeGuards.splice(index, 1);
            };
        },
        afterEach(hook) {
            afterHooks.push(hook);
            return () => {
                const index = afterHooks.indexOf(hook);
                if (index > -1)
                    afterHooks.splice(index, 1);
            };
        },
        isReady() {
            if (isReady)
                return Promise.resolve();
            return readyPromise;
        },
    };
    currentRoute.value = parseLocation(window.location);
    isReady = true;
    readyResolve?.();
    setRouter(router);
    return router;
}
//# sourceMappingURL=router.js.map