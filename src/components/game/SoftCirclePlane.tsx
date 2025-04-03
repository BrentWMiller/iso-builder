import { useRef } from 'react';
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
      // Calculate distance from center
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      
      // Create soft edge using smoothstep
      float edge = smoothstep(0.5, 0.4, dist);
      
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

export default function SoftCirclePlane({ size, color = '#2a2a2a', opacity = 0.6 }: SoftCirclePlaneProps) {
  const materialRef = useRef<ShaderMaterial>(null);
  const { isDragging, handlePointerDown, handlePointerMove, handlePointerUp } = useDragDetection();
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
  };

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[size / 2, -0.5, size / 2]}
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
}
