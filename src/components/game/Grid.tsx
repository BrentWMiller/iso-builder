import { GRID_SIZE } from '../../constants';
import { Grid as DreiGrid } from '@react-three/drei';
import SoftCirclePlane from './SoftCirclePlane';
import { memo, useMemo } from 'react';
import { useTheme } from '../../store/gameState';

const Grid = memo(function Grid() {
  const theme = useTheme();

  // Memoize the grid colors to prevent unnecessary calculations
  const { gridColor, cellColor, sectionColor } = useMemo(
    () => ({
      gridColor: theme === 'dark' ? '#2a2a2a' : '#e5e5e5',
      cellColor: theme === 'dark' ? '#000000' : '#cccccc',
      sectionColor: theme === 'dark' ? '#444444' : '#999999',
    }),
    [theme]
  );

  // Memoize the grid position as a tuple with specific length
  const gridPosition = useMemo(() => [GRID_SIZE / 2, -0.49, GRID_SIZE / 2] as [number, number, number], []);

  return (
    <group>
      {/* Main grid plane */}
      <SoftCirclePlane size={GRID_SIZE} color={gridColor} opacity={0.5} />

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
        position={gridPosition}
      />
    </group>
  );
});

Grid.displayName = 'Grid';

export default Grid;
