import { useRef, useEffect } from 'react';
import { Mesh, Vector3, MeshStandardMaterial } from 'three';
import { useGameStore } from '../../store/gameState';
import { useDragDetection } from '../../hooks/useDragDetection';
import { blockRegistry } from '../../plugins/blocks';

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

  // Get the block plugin
  const plugin = blockRegistry.get(type);

  // Create mesh using the plugin
  const mesh = plugin?.createMesh(position, color);

  // Update material colors based on hover state
  useEffect(() => {
    if (!mesh || !ref.current) return;

    const updateMaterialColor = (material: MeshStandardMaterial, index: number) => {
      if (hoveredBlockId === id && hoveredFaceIndex === index) {
        material.color.setHex(0xadd8e6); // Simple light blue highlight
      } else {
        material.color.setStyle(color);
      }
    };

    if (mesh.material instanceof Array) {
      mesh.material.forEach((material, index) => {
        updateMaterialColor(material as MeshStandardMaterial, index);
      });
    } else if (mesh.material) {
      updateMaterialColor(mesh.material as MeshStandardMaterial, hoveredFaceIndex ?? 0);
    }

    // Cleanup function to reset materials when component unmounts
    return () => {
      if (mesh.material instanceof Array) {
        mesh.material.forEach((material) => {
          (material as MeshStandardMaterial).color.setStyle(color);
        });
      } else if (mesh.material) {
        (mesh.material as MeshStandardMaterial).color.setStyle(color);
      }
    };
  }, [color, id, hoveredBlockId, hoveredFaceIndex, mesh]);

  const handleClick = (event: { stopPropagation: () => void; face?: { normal: Vector3 }; point?: Vector3; button?: number }) => {
    event.stopPropagation();

    // Don't add/remove blocks if we were dragging
    if (isDragging) return;

    // Right click to remove block
    if (event.button === 2) {
      removeBlock(id);
      return;
    }

    // Left click to add block
    if (!event.face || !event.point || !plugin) return;

    // Calculate new block position using the actual click point and face normal
    const newPosition = plugin.getPlacementPosition(event.point, event.face.normal);

    // Check if we can place the block using the plugin
    if (!plugin.canPlace(newPosition, blocks)) return;

    // Add the new block
    addBlock({
      position: newPosition,
      type: selectedBlockType,
      color: selectedColor,
    });
  };

  if (!plugin || !mesh) {
    console.error(`Block plugin not found for type: ${type}`);
    return null;
  }

  return (
    <primitive
      ref={ref}
      object={mesh}
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
