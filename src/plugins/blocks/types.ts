import { Mesh, MeshStandardMaterial, Vector3 } from 'three';

export interface BlockPlugin {
  type: string;
  displayName: string;
  description: string;

  /**
   * Creates a mesh with materials for the block
   */
  createMesh: (color: string) => {
    mesh: Mesh;
    materials: MeshStandardMaterial[];
  };

  /**
   * Get the position where a new block should be placed
   * This is the primary method used for block placement in the original implementation
   * It uses the face normal to determine where to place the block
   */
  getPlacementPosition: (currentPosition: Vector3, faceNormal: Vector3) => Vector3;

  /**
   * Get the bounding box dimensions for the block
   */
  getBoundingBox: () => {
    width: number;
    height: number;
    depth: number;
  };

  /**
   * Check if a block can be placed on the specified face
   * This is a secondary method that can be used for more precise control
   * @param faceIndex The index of the face being checked
   */
  canPlaceOnFace: (faceIndex: number) => boolean;

  /**
   * Get the offset for placing a new block based on the face index
   * This is a secondary method that can be used for more precise control
   * @param faceIndex The index of the face where the block will be placed
   */
  getPlacementOffset: (faceIndex: number) => Vector3;
}
