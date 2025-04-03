import { Mesh, Vector3, BoxGeometry, MeshStandardMaterial } from 'three';
import { BaseBlockPlugin } from './BaseBlockPlugin';

export class StairBlockPlugin extends BaseBlockPlugin {
  type = 'stair';
  displayName = 'Stair';
  description = 'A stair block that can be used to create stairs';

  createMesh(position: Vector3, color: string): Mesh {
    const geometry = new BoxGeometry(1, 0.5, 1);
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
    mesh.position.y += 0.25; // Center the stair vertically
    return mesh;
  }

  getPlacementPosition(clickPosition: Vector3, faceNormal?: Vector3): Vector3 {
    const position = super.getPlacementPosition(clickPosition, faceNormal);
    if (faceNormal) {
      // Adjust position based on face normal for better stair placement
      if (faceNormal.y > 0) {
        position.y += 0.25; // Adjust for stair height
      }
    }
    return position;
  }
}
