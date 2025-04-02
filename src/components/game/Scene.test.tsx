import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import Scene from './Scene';
import { useGameStore } from '../../store/gameState';
import type { Mock } from 'vitest';

// Mock Three.js components
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='canvas-container' style={{ width: '100vw', height: '100vh' }}>
      {children}
    </div>
  ),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid='orbit-controls'>OrbitControls</div>,
}));

// Mock the game store
vi.mock('../../store/gameState', () => ({
  useGameStore: vi.fn(),
}));

// Mock the Block and Grid components
vi.mock('./Block', () => ({
  default: () => <div data-testid='block'>Block</div>,
}));

vi.mock('./Grid', () => ({
  default: () => <div data-testid='grid'>Grid</div>,
}));

describe('Scene Component', () => {
  const mockBlocks = [
    { id: '1', position: { x: 0, y: 0, z: 0 }, type: 'cube', color: '#ff0000' },
    { id: '2', position: { x: 1, y: 0, z: 1 }, type: 'cube', color: '#00ff00' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useGameStore as unknown as Mock).mockImplementation(() => mockBlocks);
  });

  const renderScene = () => {
    return render(<Scene />);
  };

  it('renders without crashing', () => {
    renderScene();
  });

  it('renders with correct canvas container', () => {
    const { getByTestId } = renderScene();
    const container = getByTestId('canvas-container');
    expect(container).toBeTruthy();
    expect(container.style.width).toBe('100vw');
    expect(container.style.height).toBe('100vh');
  });

  it('renders the correct number of blocks', () => {
    const { getAllByTestId } = renderScene();
    const blocks = getAllByTestId('block');
    expect(blocks).toHaveLength(mockBlocks.length);
  });

  it('renders the grid', () => {
    const { getByTestId } = renderScene();
    expect(getByTestId('grid')).toBeTruthy();
  });

  it('renders orbit controls', () => {
    const { getByTestId } = renderScene();
    expect(getByTestId('orbit-controls')).toBeTruthy();
  });

  it('renders lighting elements', () => {
    const { container } = renderScene();
    expect(container.querySelector('ambientlight')).toBeTruthy();
    expect(container.querySelectorAll('directionallight')).toHaveLength(3);
  });
});
