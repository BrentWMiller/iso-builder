import { blockPluginRegistry } from './registry';
import cubePlugin from './cube';

// Register all block plugins
blockPluginRegistry.register(cubePlugin);

export { blockPluginRegistry };
