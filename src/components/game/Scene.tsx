import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, SoftShadows } from '@react-three/drei';
import { useGameStore } from '../../store/gameState';
import { GRID_SIZE } from '../../constants';
import Grid from './Grid';
import Block from './Block';
import { Raycaster, Vector2 } from 'three';
import { useEffect, useMemo, useCallback, useRef } from 'react';
import ColorToolbar from '../ui/ColorToolbar';
import ThemeToggle from '../ui/ThemeToggle';
import BuildManager from '../ui/BuildManager';

function SceneContent() {
  const blocks = useGameStore((state) => state.blocks);
  const setHoveredBlock = useGameStore((state) => state.setHoveredBlock);
  const setHoveredFace = useGameStore((state) => state.setHoveredFace);
  const { camera, scene } = useThree();

  // Memoize the raycaster to prevent recreation on each render
  const raycaster = useMemo(() => new Raycaster(), []);
  const mouse = useMemo(() => new Vector2(), []);

  // Use ref for throttling instead of function property
  const lastCallTimeRef = useRef<number>(0);

  // Throttle the pointer move event to reduce unnecessary calculations
  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      // Throttle to every 50ms (20fps)
      const now = Date.now();
      if (now - lastCallTimeRef.current > 50) {
        lastCallTimeRef.current = now;

        // Calculate mouse position in normalized device coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

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
      }
    },
    [blocks, camera, scene, setHoveredBlock, setHoveredFace, raycaster, mouse]
  );

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [handlePointerMove]);

  // Memoize the blocks rendering to prevent unnecessary re-renders
  const blockElements = useMemo(
    () => blocks.map((block) => <Block key={block.id} id={block.id} position={block.position} color={block.color} />),
    [blocks]
  );

  return (
    <>
      <SoftShadows size={10} focus={0.25} samples={10} />

      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.95} />

      {/* Main directional light for primary shadows */}
      <directionalLight
        position={[15, 15, 10]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />

      {/* Fill light for better definition */}
      <directionalLight position={[-15, 10, -10]} intensity={1.8} />

      {/* Point light for localized color enhancement */}
      <pointLight position={[0, 15, 0]} intensity={1.5} distance={30} decay={1} />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={10}
        maxDistance={40}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 4}
        target={[GRID_SIZE / 2, 0, GRID_SIZE / 2]}
      />

      <Grid />

      {blockElements}
    </>
  );
}

export default function Scene() {
  const theme = useGameStore((state) => state.theme);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: theme === 'dark' ? '#242424' : '#ffffff',
      }}
    >
      <Canvas
        camera={{
          position: [20, 20, 20],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        shadows
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        performance={{ min: 0.5 }}
      >
        <SceneContent />
      </Canvas>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <ColorToolbar />
          <ThemeToggle />
          <BuildManager />
        </div>
      </div>
    </div>
  );
}
