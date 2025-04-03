import { GRID_SIZE } from '../../constants';
import { Grid as DreiGrid } from '@react-three/drei';
import SoftCirclePlane from './SoftCirclePlane';
import { useGameStore } from '../../store/gameState';

interface GridProps {
  size?: number;
}

export default function Grid({ size = GRID_SIZE }: GridProps) {
  const theme = useGameStore((state) => state.theme);

  const gridColor = theme === 'dark' ? '#2a2a2a' : '#e5e5e5';
  const cellColor = theme === 'dark' ? '#000000' : '#cccccc';
  const sectionColor = theme === 'dark' ? '#444444' : '#999999';

  return (
    <group>
      {/* Main grid plane */}
      <SoftCirclePlane size={size} color={gridColor} opacity={0.5} />

      {/* Grid lines */}
      <DreiGrid
        infiniteGrid
        cellSize={1}
        cellThickness={1}
        cellColor={cellColor}
        sectionSize={1}
        sectionThickness={1}
        sectionColor={sectionColor}
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        position={[size / 2, -0.49, size / 2]}
      />
    </group>
  );
}
