import { Mesh, Vector3 } from 'three';
import { BaseBlockPlugin } from './BaseBlockPlugin';

export class CubeBlockPlugin extends BaseBlockPlugin {
  type = 'cube';
  displayName = 'Cube';
  description = 'A basic cube block';

  createMesh(position: Vector3, color: string): Mesh {
    return this.createBaseMesh(position, color);
  }
}
