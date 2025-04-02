import { useRef } from 'react';
import { Mesh, BackSide } from 'three';
import { useGameStore } from '../../store/gameState';
import { Block as BlockType } from '../../store/types';
import { MeshToonMaterial } from 'three';

export default function Block({ id, position, color, type }: BlockType) {
  const ref = useRef<Mesh>(null);
  const removeBlock = useGameStore((state) => state.removeBlock);

  const handleClick = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    if (event.shiftKey) {
      removeBlock(id);
    }
  };

  return (
    <group position={position}>
      {/* Main block with toon material */}
      <mesh ref={ref} onClick={handleClick}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color={color} />
      </mesh>

      {/* Outline mesh */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color='black' side={BackSide} />
      </mesh>
    </group>
  );
}
