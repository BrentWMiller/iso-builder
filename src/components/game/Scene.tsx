import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGameStore } from '../../store/gameState';
import { GRID_SIZE } from '../../constants';
import Grid from './Grid';
import Block from './Block';
import { Raycaster, Vector2 } from 'three';
import { useEffect } from 'react';
import ColorToolbar from '../ui/ColorToolbar';

function SceneContent() {
  const blocks = useGameStore((state) => state.blocks);
  const setHoveredBlock = useGameStore((state) => state.setHoveredBlock);
  const setHoveredFace = useGameStore((state) => state.setHoveredFace);
  const { camera, scene } = useThree();
  const raycaster = new Raycaster();

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const mouse = new Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Find all intersected objects
      const intersects = raycaster.intersectObjects(scene.children, true);

      // Find the closest block intersection
      const closestIntersection = intersects.find((intersect) => {
        const block = blocks.find((b) => b.id === intersect.object.userData.blockId);
        return block !== undefined;
      });

      // Update hover state
      if (closestIntersection) {
        const blockId = closestIntersection.object.userData.blockId;
        const faceIndex = closestIntersection.face?.materialIndex ?? null;
        setHoveredBlock(blockId);
        setHoveredFace(faceIndex);
      } else {
        setHoveredBlock(null);
        setHoveredFace(null);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [blocks, camera, scene, setHoveredBlock, setHoveredFace]);

  return (
    <>
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
        <Block key={block.id} id={block.id} position={block.position} color={block.color} />
      ))}
    </>
  );
}

export default function Scene() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{
          position: [15, 15, 15],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        shadows='soft'
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <SceneContent />
      </Canvas>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <ColorToolbar />
        </div>
      </div>
    </div>
  );
}
