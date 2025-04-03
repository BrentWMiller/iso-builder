import { useRef, useEffect } from 'react';
import { Mesh, Vector3 } from 'three';
import { useGameStore } from '../../store/gameState';
import { useDragDetection } from '../../hooks/useDragDetection';
import { blockPluginRegistry } from '../../plugins/blocks';

interface BlockProps {
  position: Vector3;
  color: string;
  id: string;
  type: string;
}

export default function Block({ position, color, id, type }: BlockProps) {
  const ref = useRef<Mesh>(null);
  const { isDragging, handlePointerDown, handlePointerMove: handleDragMove, handlePointerUp } = useDragDetection();
  const addBlock = useGameStore((state) => state.addBlock);
  const removeBlock = useGameStore((state) => state.removeBlock);
  const blocks = useGameStore((state) => state.blocks);
  const selectedBlockType = useGameStore((state) => state.selectedBlockType);
  const selectedColor = useGameStore((state) => state.selectedColor);
  const hoveredBlockId = useGameStore((state) => state.hoveredBlockId);
  const hoveredFaceIndex = useGameStore((state) => state.hoveredFaceIndex);

  const plugin = blockPluginRegistry.get(type);
  const { mesh, materials } = plugin?.createMesh(color) || { mesh: null, materials: [] };

  // Update material colors based on hover state
  useEffect(() => {
    if (!materials.length) return;

    materials.forEach((material, index) => {
      if (hoveredBlockId === id && hoveredFaceIndex === index) {
        material.color.setHex(0xadd8e6); // Simple light blue highlight
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
  }, [color, id, hoveredBlockId, hoveredFaceIndex, materials]);

  const isBlockAtPosition = (pos: Vector3) => {
    return blocks.some(
      (block) => Math.abs(block.position.x - pos.x) < 0.1 && Math.abs(block.position.y - pos.y) < 0.1 && Math.abs(block.position.z - pos.z) < 0.1
    );
  };

  const handleClick = (event: {
    stopPropagation: () => void;
    face?: {
      normal: Vector3;
    };
    button?: number;
  }) => {
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

    console.log('Placing block with normal:', [normal.x, normal.y, normal.z], 'new position:', [newPosition.x, newPosition.y, newPosition.z]);

    // Check if there's already a block at the target position
    if (isBlockAtPosition(newPosition)) return;

    // Add the new block
    addBlock({
      position: newPosition,
      type: selectedBlockType,
      color: selectedColor,
    });
  };

  if (!plugin || !mesh) {
    console.error(`No plugin found for block type: ${type}`);
    return null;
  }

  return (
    <primitive
      ref={ref}
      object={mesh}
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
    />
  );
}
