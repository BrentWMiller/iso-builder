import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import Grid from './Grid';
import { useGameStore } from '../../store/gameState';
import { Vector3 } from 'three';

// Mock the game store
vi.mock('../../store/gameState', () => ({
  useGameStore: vi.fn(),
}));

describe('Grid Component', () => {
  const mockAddBlock = vi.fn();
  const mockSelectedBlockType = 'cube';
  const mockSelectedColor = '#ff0000';

  beforeEach(() => {
    vi.clearAllMocks();
    (useGameStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector.name === 'addBlock') return mockAddBlock;
      if (selector.name === 'selectedBlockType') return mockSelectedBlockType;
      if (selector.name === 'selectedColor') return mockSelectedColor;
      return undefined;
    });
  });

  it('renders without crashing', () => {
    render(
      <Canvas>
        <Grid />
      </Canvas>
    );
  });

  it('renders with WebGL context', () => {
    const { container } = render(
      <Canvas>
        <Grid />
      </Canvas>
    );
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('handles click events and adds blocks', () => {
    const { container } = render(
      <Canvas>
        <Grid />
      </Canvas>
    );

    // Get the grid mesh
    const gridMesh = container.querySelector('mesh');
    if (gridMesh) {
      // Create a mock Three.js event
      const mockEvent = {
        point: new Vector3(1.5, 0, 1.5),
        stopPropagation: vi.fn(),
      };

      // Simulate the click event
      const clickHandler = gridMesh.props.onClick;
      clickHandler(mockEvent);

      // Verify that addBlock was called with the correct parameters
      expect(mockAddBlock).toHaveBeenCalledWith({
        position: expect.any(Vector3),
        type: mockSelectedBlockType,
        color: mockSelectedColor,
      });
    }
  });
});
