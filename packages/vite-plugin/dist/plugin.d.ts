/**
 * Main Vite plugin for BromiumJS file-based routing.
 * @module
 */
import type { Plugin } from 'vite';
/**
 * Configuration options for the Bromium Vite plugin.
 */
export interface BromiumPluginOptions {
    /**
     * Directory containing page components.
     * @default 'src/pages'
     */
    pagesDir?: string;
    /**
     * Output path for generated routes file.
     * @default 'src/routes.generated.ts'
     */
    routesOutput?: string;
    /**
     * Base path for all routes (e.g., '/app/').
     * @default ''
     */
    base?: string;
    /**
     * Generate TypeScript type definitions for routes.
     * @default true
     */
    generateTypes?: boolean;
}
/**
 * Creates the Bromium Vite plugin for file-based routing.
 * Automatically scans the pages directory and generates route configuration.
 *
 * @param options - Plugin configuration options
 * @returns A Vite plugin instance
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import { bromiumPlugin } from '@bromium/vite-plugin';
 *
 * export default defineConfig({
 *   plugins: [
 *     bromiumPlugin({
 *       pagesDir: 'src/pages',
 *       base: '/app/',
 *       generateTypes: true,
 *     }),
 *   ],
 * });
 * ```
 */
export declare function bromiumPlugin(options?: BromiumPluginOptions): Plugin;
export default bromiumPlugin;
//# sourceMappingURL=plugin.d.ts.map