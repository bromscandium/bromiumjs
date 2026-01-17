/**
 * File system scanner for discovering page routes.
 * @module
 */
import * as fs from 'fs';
import * as path from 'path';
const VALID_EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js'];
const IGNORED_FILES = ['_app', '_document', '_error', '404', '500'];
const IGNORED_PREFIXES = ['_', '.'];
const layoutsMap = new Map();
/**
 * Scans a pages directory and returns all discovered routes.
 * Supports Next.js-style file-based routing conventions including:
 * - `page.tsx` files for page components
 * - `layout.tsx` files for layout wrappers
 * - `[param]` for dynamic route segments
 * - `[...slug]` for catch-all routes
 * - `(group)` folders for route grouping without URL segments
 *
 * @param pagesDir - The directory to scan for pages
 * @returns An array of scanned route information, sorted by priority
 *
 * @example
 * ```ts
 * const routes = scanPages('./src/pages');
 * // Returns routes sorted: static > dynamic > catch-all
 * ```
 */
export function scanPages(pagesDir) {
    if (!fs.existsSync(pagesDir)) {
        return [];
    }
    layoutsMap.clear();
    scanForLayouts(pagesDir, '');
    const routes = [];
    scanDirectory(pagesDir, '', '', routes);
    for (const route of routes) {
        const layout = findLayoutForRoute(route.fsPath);
        if (layout) {
            route.layoutPath = layout;
        }
    }
    return routes.sort((a, b) => {
        if (a.isCatchAll !== b.isCatchAll) {
            return a.isCatchAll ? 1 : -1;
        }
        if (a.isDynamic !== b.isDynamic) {
            return a.isDynamic ? 1 : -1;
        }
        const aSegments = a.routePath.split('/').filter(Boolean).length;
        const bSegments = b.routePath.split('/').filter(Boolean).length;
        if (aSegments !== bSegments) {
            return aSegments - bSegments;
        }
        return a.routePath.localeCompare(b.routePath);
    });
}
function scanForLayouts(dir, fsRelativePath) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const name = entry.name;
        if (IGNORED_PREFIXES.some(prefix => name.startsWith(prefix))) {
            continue;
        }
        const fullPath = path.join(dir, name);
        if (entry.isDirectory()) {
            const newFsPath = fsRelativePath ? `${fsRelativePath}/${name}` : name;
            scanForLayouts(fullPath, newFsPath);
        }
        else if (entry.isFile()) {
            const ext = path.extname(name);
            if (!VALID_EXTENSIONS.includes(ext))
                continue;
            const baseName = path.basename(name, ext);
            if (baseName === 'layout' || baseName === '_layout') {
                const fsPath = '/' + fsRelativePath.replace(/\\/g, '/');
                layoutsMap.set(fsPath.replace(/\/+/g, '/') || '/', fullPath.replace(/\\/g, '/'));
            }
        }
    }
}
function findLayoutForRoute(fsPath) {
    let current = fsPath;
    while (current) {
        const layout = layoutsMap.get(current);
        if (layout)
            return layout;
        const lastSlash = current.lastIndexOf('/');
        if (lastSlash <= 0)
            break;
        current = current.substring(0, lastSlash);
    }
    return layoutsMap.get('/');
}
function isRouteGroup(name) {
    return name.startsWith('(') && name.endsWith(')');
}
function scanDirectory(dir, routeRelativePath, fsRelativePath, routes) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const name = entry.name;
        if (IGNORED_PREFIXES.some(prefix => name.startsWith(prefix))) {
            continue;
        }
        const fullPath = path.join(dir, name);
        if (entry.isDirectory()) {
            const routeSegment = isRouteGroup(name) ? '' : name;
            const newRoutePath = routeSegment
                ? (routeRelativePath ? `${routeRelativePath}/${routeSegment}` : routeSegment)
                : routeRelativePath;
            const newFsPath = fsRelativePath ? `${fsRelativePath}/${name}` : name;
            scanDirectory(fullPath, newRoutePath, newFsPath, routes);
        }
        else if (entry.isFile()) {
            const ext = path.extname(name);
            if (!VALID_EXTENSIONS.includes(ext)) {
                continue;
            }
            const baseName = path.basename(name, ext);
            if (IGNORED_FILES.includes(baseName)) {
                continue;
            }
            if (baseName === '_layout' || baseName === 'layout') {
                continue;
            }
            const route = parseRoute(fullPath, routeRelativePath, fsRelativePath, baseName);
            if (route) {
                routes.push(route);
            }
        }
    }
}
function parseRoute(filePath, routeRelativePath, fsRelativePath, baseName) {
    const isPage = baseName === 'page';
    const isLayout = baseName === '_layout' || baseName === 'layout';
    let routePath = '/' + routeRelativePath.replace(/\\/g, '/');
    if (!isPage) {
        routePath = routePath === '/'
            ? `/${baseName}`
            : `${routePath}/${baseName}`;
    }
    const fsPath = '/' + fsRelativePath.replace(/\\/g, '/');
    const params = [];
    let isDynamic = false;
    let isCatchAll = false;
    routePath = routePath.replace(/\[\.\.\.(\w+)]/g, (_, paramName) => {
        params.push(paramName);
        isDynamic = true;
        isCatchAll = true;
        return `:${paramName}*`;
    });
    routePath = routePath.replace(/\[(\w+)]/g, (_, paramName) => {
        params.push(paramName);
        isDynamic = true;
        return `:${paramName}`;
    });
    routePath = routePath.replace(/\/+/g, '/');
    if (routePath.length > 1 && routePath.endsWith('/')) {
        routePath = routePath.slice(0, -1);
    }
    const segments = routePath.split('/').filter(Boolean);
    return {
        filePath: filePath.replace(/\\/g, '/'),
        routePath,
        isDynamic,
        params,
        isPage,
        isLayout,
        isCatchAll,
        segments,
        fsPath: fsPath.replace(/\/+/g, '/') || '/',
    };
}
/**
 * Watches a pages directory for changes and invokes a callback when files change.
 *
 * @param pagesDir - The directory to watch
 * @param onChange - Callback invoked when a page file changes
 * @returns A function to stop watching
 *
 * @example
 * ```ts
 * const stop = watchPages('./src/pages', () => {
 *   console.log('Pages changed, regenerating routes...');
 * });
 *
 * // Later: stop watching
 * stop();
 * ```
 */
export function watchPages(pagesDir, onChange) {
    if (!fs.existsSync(pagesDir)) {
        fs.mkdirSync(pagesDir, { recursive: true });
    }
    const watcher = fs.watch(pagesDir, { recursive: true }, (_eventType, filename) => {
        if (!filename)
            return;
        const ext = path.extname(filename);
        if (VALID_EXTENSIONS.includes(ext)) {
            onChange();
        }
    });
    return () => watcher.close();
}
//# sourceMappingURL=scanner.js.map