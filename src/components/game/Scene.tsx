import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGameStore } from '../../store/gameState';
import { GRID_SIZE } from '../../constants';
import Grid from './Grid';
import Block from './Block';
import { Vector3 } from 'three';

export default function Scene() {
  const blocks = useGameStore((state) => state.blocks);
  const addBlock = useGameStore((state) => state.addBlock);
  const selectedBlockType = useGameStore((state) => state.selectedBlockType);
  const selectedColor = useGameStore((state) => state.selectedColor);

  const handleBlockClick = (position: Vector3) => {
    const gridX = Math.floor(position.x) + 0.5;
    const gridZ = Math.floor(position.z) + 0.5;
    const newPosition = new Vector3(gridX, position.y + 1, gridZ);

    addBlock({
      position: newPosition,
      type: selectedBlockType,
      color: selectedColor,
    });
  };

  return (
    <Canvas
      camera={{
        position: [15, 15, 15],
        fov: 50,
        near: 0.1,
        far: 1000,
      }}
      shadows='soft'
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.6} />

      {/* Main directional light for primary shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Fill light for better definition */}
      <directionalLight position={[-10, 5, -10]} intensity={0.4} />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2}
        target={[GRID_SIZE / 2, 0, GRID_SIZE / 2]}
      />

      <Grid />

      {blocks.map((block) => (
        <Block key={block.id} position={block.position} color={block.color} onBlockClick={handleBlockClick} />
      ))}
    </Canvas>
  );
}
