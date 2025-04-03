import { BlockPlugin, BlockPluginRegistry } from './types';

class BlockRegistry implements BlockPluginRegistry {
  private plugins: Map<string, BlockPlugin> = new Map();

  register(plugin: BlockPlugin): void {
    if (this.plugins.has(plugin.type)) {
      console.warn(`Block plugin with type '${plugin.type}' already exists. Overwriting...`);
    }
    this.plugins.set(plugin.type, plugin);
  }

  unregister(type: string): void {
    this.plugins.delete(type);
  }

  get(type: string): BlockPlugin | undefined {
    return this.plugins.get(type);
  }

  getAll(): BlockPlugin[] {
    return Array.from(this.plugins.values());
  }
}

// Create a singleton instance
const blockRegistry = new BlockRegistry();

export default blockRegistry;
