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

  const getHighestBlockAt = (x: number, z: number) => {
    return blocks
      .filter((block) => Math.abs(block.position.x - x) < 0.1 && Math.abs(block.position.z - z) < 0.1)
      .reduce((maxY, block) => Math.max(maxY, block.position.y), -1); // Start at -1 to handle ground level
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

    // If clicking on the grid, place the block at ground level
    const highestY = getHighestBlockAt(gridX, gridZ);
    const position = new Vector3(gridX, highestY + 1, gridZ);

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
