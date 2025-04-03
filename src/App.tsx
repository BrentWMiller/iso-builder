import Scene from './components/game/Scene';
import ColorToolbar from './components/ui/ColorToolbar';
import ThemeToggle from './components/ui/ThemeToggle';
import BuildManager from './components/ui/BuildManager';
import BlockToolbar from './components/ui/BlockToolbar';
import { useGameStore } from './store/gameState';
import './App.css';

export default function App() {
  const theme = useGameStore((state) => state.theme);

  return (
    <div
      className='w-screen h-screen'
      style={{
        backgroundColor: theme === 'dark' ? '#242424' : '#ffffff',
      }}
    >
      <Scene />
      <div className='absolute top-0 left-0 w-full h-full pointer-events-none'>
        <div className='pointer-events-auto'>
          <ColorToolbar />
          <ThemeToggle />
          <BuildManager />
          <BlockToolbar />
        </div>
      </div>
    </div>
  );
}
