import { Mesh, Vector3 } from 'three';

export interface BlockPlugin {
  type: string;
  displayName: string;
  description: string;
  createMesh: (position: Vector3, color: string) => Mesh;
  canPlace: (position: Vector3, existingBlocks: { position: Vector3 }[]) => boolean;
  getPlacementPosition: (clickPosition: Vector3, faceNormal?: Vector3) => Vector3;
}

export interface BlockPluginRegistry {
  register: (plugin: BlockPlugin) => void;
  unregister: (type: string) => void;
  get: (type: string) => BlockPlugin | undefined;
  getAll: () => BlockPlugin[];
}
