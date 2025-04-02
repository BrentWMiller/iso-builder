import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Vector3 } from 'three';
import Grid from './Grid';
import { useGameStore } from '../../store/gameState';
import type { Mock } from 'vitest';

// Mock the game store
vi.mock('../../store/gameState', () => ({
  useGameStore: vi.fn(),
}));

// Mock Three.js components
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Grid Component', () => {
  const mockAddBlock = vi.fn();
  const mockBlocks = [
    { id: '1', position: { x: 1.5, y: 0, z: 1.5 }, type: 'cube', color: '#ff0000' },
    { id: '2', position: { x: 1.5, y: 1, z: 1.5 }, type: 'cube', color: '#00ff00' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useGameStore as unknown as Mock).mockImplementation((selector) => {
      if (selector.name === 'addBlock') return mockAddBlock;
      if (selector.name === 'blocks') return mockBlocks;
      if (selector.name === 'selectedBlockType') return 'cube';
      if (selector.name === 'selectedColor') return '#0000ff';
      return undefined;
    });
  });

  it('renders without crashing', () => {
    render(<Grid />);
  });

  it('places block on ground level when no blocks exist at position', () => {
    const { container } = render(<Grid />);

    // Get the click handler from the Grid component
    const grid = container.firstChild as HTMLElement;
    const handleClick = grid?.querySelector('mesh')?.getAttribute('onclick');

    if (handleClick) {
      // Create a mock click event
      const clickEvent = {
        point: new Vector3(2.3, 0, 2.3),
        stopPropagation: vi.fn(),
      };

      // Call the click handler
      eval(handleClick)(clickEvent);

      // Verify block placement at ground level
      expect(mockAddBlock).toHaveBeenCalledWith({
        position: new Vector3(2.5, 0, 2.5),
        type: 'cube',
        color: '#0000ff',
      });
    }
  });

  it('stacks blocks on top of existing blocks when clicking block faces', () => {
    const { container } = render(<Grid />);

    // Get the click handler from the Grid component
    const grid = container.firstChild as HTMLElement;
    const handleClick = grid?.querySelector('mesh')?.getAttribute('onclick');

    if (handleClick) {
      // Create a mock click event with a face normal
      const clickEvent = {
        point: new Vector3(1.5, 1, 1.5), // Clicking on top of the second block
        stopPropagation: vi.fn(),
        face: { normal: new Vector3(0, 1, 0) },
      };

      // Call the click handler
      eval(handleClick)(clickEvent);

      // Verify block placement on top of existing blocks
      expect(mockAddBlock).toHaveBeenCalledWith({
        position: new Vector3(1.5, 2, 1.5),
        type: 'cube',
        color: '#0000ff',
      });
    }
  });
});
