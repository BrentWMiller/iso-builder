import blockRegistry from './registry';
import { CubeBlockPlugin } from './CubeBlockPlugin';
import { StairBlockPlugin } from './StairBlockPlugin';

// Register default block plugins
blockRegistry.register(new CubeBlockPlugin());
blockRegistry.register(new StairBlockPlugin());

export { blockRegistry };
export * from './types';
export * from './BaseBlockPlugin';
export * from './CubeBlockPlugin';
export * from './StairBlockPlugin';
