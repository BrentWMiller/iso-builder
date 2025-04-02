import { useRef } from 'react';
import { Mesh, Vector3 } from 'three';
import { useGameStore } from '../../store/gameState';
import { GRID_SIZE } from '../../constants';

export default function Grid() {
  const ref = useRef<Mesh>(null);
  const addBlock = useGameStore((state) => state.addBlock);
  const selectedBlockType = useGameStore((state) => state.selectedBlockType);
  const selectedColor = useGameStore((state) => state.selectedColor);

  const handleClick = (event: { point: Vector3; stopPropagation: () => void }) => {
    event.stopPropagation();

    // Place blocks in the center of grid squares
    const position = new Vector3(Math.floor(event.point.x) + 0.5, Math.floor(event.point.y) + 1, Math.floor(event.point.z) + 0.5);

    addBlock({
      position,
      type: selectedBlockType,
      color: selectedColor,
    });
  };

  return (
    <group>
      {/* Main grid plane */}
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[GRID_SIZE / 2, -0.5, GRID_SIZE / 2]} onClick={handleClick}>
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshToonMaterial color='#2a2a2a' transparent opacity={0.6} />
      </mesh>

      {/* Grid lines */}
      <gridHelper args={[GRID_SIZE, GRID_SIZE, '#000000', '#444444']} position={[GRID_SIZE / 2, -0.49, GRID_SIZE / 2]} />
    </group>
  );
}
