import { useRef } from 'react';
import { Mesh, Vector3 } from 'three';

interface BlockProps {
  position: Vector3;
  color: string;
  onBlockClick: (position: Vector3, face: { normal: Vector3 }) => void;
}

export default function Block({ position, color, onBlockClick }: BlockProps) {
  const ref = useRef<Mesh>(null);

  const handleClick = (event: { stopPropagation: () => void; face?: { normal: Vector3 } }) => {
    event.stopPropagation();
    // Only handle clicks on the top face
    if (event.face?.normal.y === 1) {
      onBlockClick(position, event.face);
    }
  };

  return (
    <mesh ref={ref} position={position} onClick={handleClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshToonMaterial color={color} />
    </mesh>
  );
}
