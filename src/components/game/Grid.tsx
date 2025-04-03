import { useRef } from 'react';
import { Mesh, Vector3 } from 'three';
import { useGameStore } from '../../store/gameState';
import { GRID_SIZE } from '../../constants';
import { Grid as DreiGrid } from '@react-three/drei';

export default function Grid() {
  const ref = useRef<Mesh>(null);
  const addBlock = useGameStore((state) => state.addBlock);
  const blocks = useGameStore((state) => state.blocks);
  const selectedBlockType = useGameStore((state) => state.selectedBlockType);
  const selectedColor = useGameStore((state) => state.selectedColor);

  const getBlocksInColumn = (x: number, z: number) => {
    return blocks
      .filter((block) => Math.abs(block.position.x - x) < 0.1 && Math.abs(block.position.z - z) < 0.1)
      .sort((a, b) => a.position.y - b.position.y);
  };

  const findLowestEmptyPosition = (x: number, z: number) => {
    const columnBlocks = getBlocksInColumn(x, z);
    let y = 0; // Start at ground level

    // Find the first gap in the stack
    for (const block of columnBlocks) {
      if (Math.abs(block.position.y - y) > 0.1) {
        // Found a gap
        break;
      }
      y++;
    }

    return y;
  };

  const handleClick = (event: { point: Vector3; stopPropagation: () => void; face?: { normal: Vector3 } }) => {
    event.stopPropagation();

    // Get grid coordinates
    const gridX = Math.floor(event.point.x) + 0.5;
    const gridZ = Math.floor(event.point.z) + 0.5;

    // If clicking on a block face, place the new block on top of that block
    if (event.face) {
      const clickedBlock = blocks.find(
        (block) =>
          Math.abs(block.position.x - gridX) < 0.1 && Math.abs(block.position.z - gridZ) < 0.1 && Math.abs(block.position.y - event.point.y) < 0.1
      );

      if (clickedBlock) {
        const position = new Vector3(gridX, clickedBlock.position.y + 1, gridZ);
        addBlock({
          position,
          type: selectedBlockType,
          color: selectedColor,
        });
        return;
      }
    }

    // Place block at the lowest empty position in the column
    const y = findLowestEmptyPosition(gridX, gridZ);
    const position = new Vector3(gridX, y, gridZ);

    addBlock({
      position,
      type: selectedBlockType,
      color: selectedColor,
    });
  };

  return (
    <group>
      {/* Main grid plane */}
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[GRID_SIZE / 2, -0.5, GRID_SIZE / 2]} onClick={handleClick} receiveShadow>
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshStandardMaterial color='#2a2a2a' transparent={true} opacity={0.6} roughness={0.9} metalness={0.1} />
      </mesh>

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
