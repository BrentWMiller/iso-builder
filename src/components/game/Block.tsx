import { useRef } from 'react';
import { Mesh, Vector3 } from 'three';
import { useGameStore } from '../../store/gameState';
import { useDragDetection } from '../../hooks/useDragDetection';

interface BlockProps {
  position: Vector3;
  color: string;
  id: string;
}

export default function Block({ position, color, id }: BlockProps) {
  const ref = useRef<Mesh>(null);
  const { isDragging, handlePointerDown, handlePointerMove, handlePointerUp } = useDragDetection();
  const addBlock = useGameStore((state) => state.addBlock);
  const removeBlock = useGameStore((state) => state.removeBlock);
  const blocks = useGameStore((state) => state.blocks);
  const selectedBlockType = useGameStore((state) => state.selectedBlockType);
  const selectedColor = useGameStore((state) => state.selectedColor);

  const isBlockAtPosition = (pos: Vector3) => {
    return blocks.some(
      (block) => Math.abs(block.position.x - pos.x) < 0.1 && Math.abs(block.position.y - pos.y) < 0.1 && Math.abs(block.position.z - pos.z) < 0.1
    );
  };

  const handleClick = (event: { stopPropagation: () => void; face?: { normal: Vector3 }; button?: number }) => {
    event.stopPropagation();

    // Don't add/remove blocks if we were dragging
    if (isDragging) return;

    // Right click to remove block
    if (event.button === 2) {
      removeBlock(id);
      return;
    }

    // Left click to add block
    if (!event.face) return;

    // Calculate new block position based on face normal
    const normal = event.face.normal;
    const newPosition = new Vector3(position.x + normal.x, position.y + normal.y, position.z + normal.z);

    // Check if there's already a block at the target position
    if (isBlockAtPosition(newPosition)) return;

    // Add the new block
    addBlock({
      position: newPosition,
      type: selectedBlockType,
      color: selectedColor,
    });
  };

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={handleClick}
      onContextMenu={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.1} />
    </mesh>
  );
}
