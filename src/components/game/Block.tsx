import { useRef, useEffect } from 'react';
import { Mesh, Vector3, MeshStandardMaterial } from 'three';
import { useGameStore } from '../../store/gameState';
import { useDragDetection } from '../../hooks/useDragDetection';

interface BlockProps {
  position: Vector3;
  color: string;
  id: string;
}

export default function Block({ position, color, id }: BlockProps) {
  const ref = useRef<Mesh>(null);
  const { isDragging, handlePointerDown, handlePointerMove: handleDragMove, handlePointerUp } = useDragDetection();
  const addBlock = useGameStore((state) => state.addBlock);
  const removeBlock = useGameStore((state) => state.removeBlock);
  const blocks = useGameStore((state) => state.blocks);
  const selectedBlockType = useGameStore((state) => state.selectedBlockType);
  const selectedColor = useGameStore((state) => state.selectedColor);
  const hoveredBlockId = useGameStore((state) => state.hoveredBlockId);
  const hoveredFaceIndex = useGameStore((state) => state.hoveredFaceIndex);

  // Create materials for each face
  const materials = [
    new MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05 }), // right
    new MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05 }), // left
    new MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05 }), // top
    new MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05 }), // bottom
    new MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05 }), // front
    new MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05 }), // back
  ];

  // Update material colors based on hover state
  useEffect(() => {
    materials.forEach((material, index) => {
      if (hoveredBlockId === id && hoveredFaceIndex === index) {
        material.color.setHex(0xadd8e6); // Light blue highlight
      } else {
        material.color.setStyle(color);
      }
    });

    // Cleanup function to reset materials when component unmounts
    return () => {
      materials.forEach((material) => {
        material.color.setStyle(color);
      });
    };
  }, [color, id, hoveredBlockId, hoveredFaceIndex]);

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
      onPointerMove={handleDragMove}
      onPointerUp={handlePointerUp}
      name={id}
      userData={{ blockId: id }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      {materials.map((material, index) => (
        <primitive key={index} object={material} attach={`material-${index}`} />
      ))}
    </mesh>
  );
}
