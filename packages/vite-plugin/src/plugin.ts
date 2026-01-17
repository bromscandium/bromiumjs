/**
 * Main Vite plugin for BromiumJS file-based routing.
 * @module
 */

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import * as path from 'path';
import * as fs from 'fs';
import { scanPages, watchPages } from './scanner.js';
import { generateRouteConfig, generateRouteTypes } from './codegen.js';

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
 * import { bromiumPlugin } from '@bromscandium/vite-plugin';
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
export function bromiumPlugin(options: BromiumPluginOptions = {}): Plugin {
  const {
    pagesDir = 'src/pages',
    routesOutput = 'src/routes.generated.ts',
    base = '',
    generateTypes = true,
  } = options;

  let root: string;
  let fullPagesDir: string;
  let fullRoutesOutput: string;
  let stopWatcher: (() => void) | null = null;

  async function generateRoutes(): Promise<void> {
    if (!fs.existsSync(fullPagesDir)) {
      fs.mkdirSync(fullPagesDir, { recursive: true });
    }

    const routes = scanPages(fullPagesDir);

    const code = generateRouteConfig(routes, {
      pagesDir: fullPagesDir,
      outputPath: fullRoutesOutput,
      base,
    });

    const outputDir = path.dirname(fullRoutesOutput);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(fullRoutesOutput, code, 'utf-8');

    if (generateTypes) {
      const typesPath = fullRoutesOutput.replace(/\.ts$/, '.d.ts');
      const typesCode = generateRouteTypes(routes);
      fs.writeFileSync(typesPath, typesCode, 'utf-8');
    }

    console.log(`[bromium] Generated routes from ${routes.length} pages`);
  }

  return {
    name: 'bromium-plugin',

    configResolved(config: ResolvedConfig) {
      root = config.root;
      fullPagesDir = path.resolve(root, pagesDir);
      fullRoutesOutput = path.resolve(root, routesOutput);
    },

    async buildStart() {
      await generateRoutes();
    },

    configureServer(server: ViteDevServer) {
      stopWatcher = watchPages(fullPagesDir, async () => {
        await generateRoutes();
        const module = server.moduleGraph.getModuleById(fullRoutesOutput);
        if (module) {
          server.moduleGraph.invalidateModule(module);
          server.ws.send({
            type: 'full-reload',
            path: '*',
          });
        }
      });
    },

    buildEnd() {
      if (stopWatcher) {
        stopWatcher();
        stopWatcher = null;
      }
    },

    transform(_code: string, id: string) {
      if (!id.endsWith('.tsx') && !id.endsWith('.jsx')) {
        return null;
      }

      return null;
    },
  };
}

export default bromiumPlugin;
