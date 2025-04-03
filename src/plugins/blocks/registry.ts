import { BlockPlugin } from './types';

class BlockPluginRegistry {
  private plugins: Map<string, BlockPlugin> = new Map();

  register(plugin: BlockPlugin) {
    if (this.plugins.has(plugin.type)) {
      throw new Error(`Block plugin with type '${plugin.type}' already registered`);
    }
    this.plugins.set(plugin.type, plugin);
  }

  get(type: string): BlockPlugin | undefined {
    return this.plugins.get(type);
  }

  getAll(): BlockPlugin[] {
    return Array.from(this.plugins.values());
  }

  getTypes(): string[] {
    return Array.from(this.plugins.keys());
  }
}

export const blockPluginRegistry = new BlockPluginRegistry();
