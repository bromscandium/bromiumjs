/**
 * File system scanner for discovering page routes.
 * @module
 */
/**
 * Information about a scanned route from the file system.
 */
export interface ScannedRoute {
    /** Absolute path to the page file */
    filePath: string;
    /** URL path for the route (e.g., '/users/:id') */
    routePath: string;
    /** Whether the route contains dynamic segments */
    isDynamic: boolean;
    /** Names of dynamic parameters in the route */
    params: string[];
    /** Whether this is a page component (page.tsx) */
    isPage: boolean;
    /** Whether this is a layout component */
    isLayout: boolean;
    /** Whether this is a catch-all route ([...slug]) */
    isCatchAll: boolean;
    /** URL path segments */
    segments: string[];
    /** Path to the layout file if one exists for this route */
    layoutPath?: string;
    /** File system relative path (includes route groups) */
    fsPath: string;
}
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
export declare function scanPages(pagesDir: string): ScannedRoute[];
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
export declare function watchPages(pagesDir: string, onChange: () => void): () => void;
//# sourceMappingURL=scanner.d.ts.map