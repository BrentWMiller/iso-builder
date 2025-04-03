import { GRID_SIZE } from '../../constants';
import { Grid as DreiGrid } from '@react-three/drei';
import SoftCirclePlane from './SoftCirclePlane';

export default function Grid() {
  return (
    <group>
      {/* Main grid plane */}
      <SoftCirclePlane size={GRID_SIZE} color='#2a2a2a' opacity={0.6} />

      {/* Grid lines */}
      <DreiGrid
        infiniteGrid
        cellSize={1}
        cellThickness={1}
        cellColor='#000000'
        sectionSize={1}
        sectionThickness={1}
        sectionColor='#444444'
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        position={[GRID_SIZE / 2, -0.49, GRID_SIZE / 2]}
      />
    </group>
  );
}
