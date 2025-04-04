import { useRef, useCallback, memo } from 'react';
import { ShaderMaterial, Color, Vector3 } from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { useGameStore } from '../../store/gameState';
import { useDragDetection } from '../../hooks/useDragDetection';

// Create a custom shader material
const SoftCircleMaterial = shaderMaterial(
  {
    color: new Color('#2a2a2a'),
    opacity: 0.6,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    uniform float opacity;
    varying vec2 vUv;
    
    void main() {
      // Calculate distance from center and scale it to make the circle wider
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center) * 0.9; // Scale down the distance to make the circle wider
      
      // Create softer edge using smoothstep with wider range
      float edge = smoothstep(0.5, 0.2, dist);
      
      // Apply color and opacity
      gl_FragColor = vec4(color, opacity * edge);
    }
  `
);

// Extend Three.js with our custom material
extend({ SoftCircleMaterial });

// Declare the custom material type for TypeScript
declare module '@react-three/fiber' {
  interface ThreeElements {
    softCircleMaterial: {
      color?: string | number | Color;
      opacity?: number;
      transparent?: boolean;
      ref?: React.Ref<ShaderMaterial>;
    };
  }
}

interface SoftCirclePlaneProps {
  size: number;
  color?: string;
  opacity?: number;
}

const SoftCirclePlane = memo(({ size, color = '#2a2a2a', opacity = 0.6 }: SoftCirclePlaneProps) => {
  const materialRef = useRef<ShaderMaterial>(null);
  const { isDragging, handlePointerDown, handlePointerMove, handlePointerUp } = useDragDetection();
  const addBlock = useGameStore((state) => state.addBlock);
  const blocks = useGameStore((state) => state.blocks);
  const selectedBlockType = useGameStore((state) => state.selectedBlockType);
  const selectedColor = useGameStore((state) => state.selectedColor);

  // Memoize helper functions to avoid recreating them on every render
  const getBlocksInColumn = useCallback(
    (x: number, z: number) => {
      return blocks
        .filter((block) => Math.abs(block.position.x - x) < 0.1 && Math.abs(block.position.z - z) < 0.1)
        .sort((a, b) => a.position.y - b.position.y);
    },
    [blocks]
  );

  const findLowestEmptyPosition = useCallback(
    (x: number, z: number) => {
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
    },
    [getBlocksInColumn]
  );

  const handleClick = useCallback(
    (event: { point: Vector3; stopPropagation: () => void; face?: { normal: Vector3 } }) => {
      event.stopPropagation();

      // Don't add blocks if we were dragging
      if (isDragging) return;

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
    },
    [isDragging, blocks, addBlock, selectedBlockType, selectedColor, findLowestEmptyPosition]
  );

  // Create rotation and position only once
  const rotation: [number, number, number] = [-Math.PI / 2, 0, 0];
  const position: [number, number, number] = [size / 2, -0.5, size / 2];

  return (
    <mesh
      rotation={rotation}
      position={position}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      receiveShadow
    >
      <planeGeometry args={[size, size, 32, 32]} />
      <softCircleMaterial ref={materialRef} color={color} opacity={opacity} transparent />
    </mesh>
  );
});

SoftCirclePlane.displayName = 'SoftCirclePlane';

export default SoftCirclePlane;
