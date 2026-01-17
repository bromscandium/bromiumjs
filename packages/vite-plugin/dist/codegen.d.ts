/**
 * Route code generation utilities.
 * @module
 */
import { ScannedRoute } from './scanner.js';
/**
 * Options for route code generation.
 */
export interface CodegenOptions {
    /** The pages directory path */
    pagesDir: string;
    /** The output file path for generated routes */
    outputPath: string;
    /** Optional base path for routes */
    base?: string;
}
/**
 * Generates TypeScript code for route configuration from scanned routes.
 * The output exports a `routes` array compatible with the Bromium router.
 *
 * @param routes - Array of scanned route information
 * @param options - Code generation options
 * @returns Generated TypeScript source code
 *
 * @example
 * ```ts
 * const routes = scanPages('./src/pages');
 * const code = generateRouteConfig(routes, {
 *   pagesDir: './src/pages',
 *   outputPath: './src/routes.generated.ts',
 * });
 * fs.writeFileSync('./src/routes.generated.ts', code);
 * ```
 */
export declare function generateRouteConfig(routes: ScannedRoute[], options: CodegenOptions): string;
/**
 * Generates TypeScript type definitions for routes.
 * Provides type-safe route paths and parameter types.
 *
 * @param routes - Array of scanned route information
 * @returns Generated TypeScript declaration code
 *
 * @example
 * ```ts
 * const routes = scanPages('./src/pages');
 * const types = generateRouteTypes(routes);
 * fs.writeFileSync('./src/routes.generated.d.ts', types);
 * ```
 */
export declare function generateRouteTypes(routes: ScannedRoute[]): string;
//# sourceMappingURL=codegen.d.ts.map