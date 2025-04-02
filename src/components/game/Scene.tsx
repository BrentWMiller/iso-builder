import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGameStore } from '../../store/gameState';
import { GRID_SIZE } from '../../constants';
import Grid from './Grid';
import Block from './Block';

export default function Scene() {
  const blocks = useGameStore((state) => state.blocks);

  return (
    <Canvas
      camera={{
        position: [15, 15, 15],
        fov: 50,
        near: 0.1,
        far: 1000,
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.2} />

      {/* Main directional light for primary shadows */}
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

      {/* Secondary lights for better definition */}
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />
      <directionalLight position={[0, -5, 0]} intensity={0.2} />

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
        <Block key={block.id} {...block} />
      ))}
    </Canvas>
  );
}
