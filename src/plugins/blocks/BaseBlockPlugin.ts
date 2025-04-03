import { Mesh, Vector3, BoxGeometry, MeshStandardMaterial } from 'three';
import { BlockPlugin } from './types';

export abstract class BaseBlockPlugin implements BlockPlugin {
  abstract type: string;
  abstract displayName: string;
  abstract description: string;

  protected createBaseMesh(position: Vector3, color: string): Mesh {
    const geometry = new BoxGeometry(1, 1, 1);
    // Create an array of materials, one for each face
    const materials = Array(6)
      .fill(null)
      .map(
        () =>
          new MeshStandardMaterial({
            color,
            roughness: 0.7,
            metalness: 0.05,
            emissive: 0x000000,
          })
      );
    const mesh = new Mesh(geometry, materials);
    mesh.position.copy(position);
    return mesh;
  }

  abstract createMesh(position: Vector3, color: string): Mesh;

  canPlace(position: Vector3, existingBlocks: { position: Vector3 }[]): boolean {
    return !existingBlocks.some(
      (block) =>
        Math.abs(block.position.x - position.x) < 0.1 &&
        Math.abs(block.position.y - position.y) < 0.1 &&
        Math.abs(block.position.z - position.z) < 0.1
    );
  }

  getPlacementPosition(clickPosition: Vector3, faceNormal?: Vector3): Vector3 {
    if (faceNormal) {
      // Simple direct placement based on face normal
      return new Vector3(clickPosition.x + faceNormal.x, clickPosition.y + faceNormal.y, clickPosition.z + faceNormal.z);
    }
    return clickPosition;
  }
}
