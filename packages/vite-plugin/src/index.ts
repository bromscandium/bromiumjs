// Vite plugin exports

import { bromiumPlugin } from './plugin.js';

export { bromiumPlugin, type BromiumPluginOptions } from './plugin.js';
export { scanPages, watchPages, type ScannedRoute } from './scanner.js';
export { generateRouteConfig, generateRouteTypes, type CodegenOptions } from './codegen.js';

export default bromiumPlugin;
