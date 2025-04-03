import { Mesh, MeshStandardMaterial, BoxGeometry, Vector3 } from 'three';
import { BlockPlugin } from './types';

// Define face indices for Three.js Box Geometry
enum FaceIndex {
  RIGHT = 0, // +X face
  LEFT = 1, // -X face
  TOP = 2, // +Y face
  BOTTOM = 3, // -Y face
  FRONT = 4, // +Z face
  BACK = 5, // -Z face
}

const cubePlugin: BlockPlugin = {
  type: 'cube',
  displayName: 'Cube',
  description: 'A standard cube block',

  createMesh: (color: string) => {
    const geometry = new BoxGeometry(1, 1, 1);

    // Create materials for each face
    const materials = [
      new MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, emissive: 0x000000 }), // right
      new MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, emissive: 0x000000 }), // left
      new MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, emissive: 0x000000 }), // top
      new MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, emissive: 0x000000 }), // bottom
      new MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, emissive: 0x000000 }), // front
      new MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, emissive: 0x000000 }), // back
    ];

    const mesh = new Mesh(geometry, materials);
    return { mesh, materials };
  },

  // This is the main method used by the Block component
  getPlacementPosition: (currentPosition: Vector3, faceNormal: Vector3) => {
    return new Vector3(currentPosition.x + faceNormal.x, currentPosition.y + faceNormal.y, currentPosition.z + faceNormal.z);
  },

  getBoundingBox: () => ({
    width: 1,
    height: 1,
    depth: 1,
  }),

  // These methods are still needed for the plugin interface but aren't directly used
  // when placing blocks with face normals
  canPlaceOnFace: (faceIndex: number) => {
    // For cubes, we allow placement on all faces (indexes 0-5)
    return faceIndex >= FaceIndex.RIGHT && faceIndex <= FaceIndex.BACK;
  },

  getPlacementOffset: (faceIndex: number): Vector3 => {
    // Define face normals for each face index
    switch (faceIndex) {
      case FaceIndex.RIGHT:
        return new Vector3(1, 0, 0);
      case FaceIndex.LEFT:
        return new Vector3(-1, 0, 0);
      case FaceIndex.TOP:
        return new Vector3(0, 1, 0);
      case FaceIndex.BOTTOM:
        return new Vector3(0, -1, 0);
      case FaceIndex.FRONT:
        return new Vector3(0, 0, 1);
      case FaceIndex.BACK:
        return new Vector3(0, 0, -1);
      default:
        console.warn(`Invalid face index: ${faceIndex}, using default offset`);
        return new Vector3(0, 0, 0);
    }
  },
};

export default cubePlugin;
