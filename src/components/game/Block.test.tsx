import { Canvas } from '@react-three/fiber';
import { render } from '@testing-library/react';
import { Vector3 } from 'three';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Block from './Block';

// Mock the store
vi.mock('../../store/gameState', () => ({
  useGameStore: vi.fn().mockImplementation((selector) =>
    selector({
      blocks: [],
      selectedBlockType: 'cube',
      selectedColor: '#ffffff',
      history: [[]],
      historyIndex: 0,
      addBlock: vi.fn(),
      removeBlock: vi.fn(),
      setSelectedBlockType: vi.fn(),
      setSelectedColor: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
    })
  ),
}));

describe('Block Component', () => {
  const defaultProps = {
    id: 'test-block-1',
    position: new Vector3(0.5, 0.5, 0.5),
    color: '#ff0000',
    type: 'cube' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <Canvas>
        <Block {...defaultProps} />
      </Canvas>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with WebGL context', () => {
    const { container } = render(
      <Canvas>
        <Block {...defaultProps} />
      </Canvas>
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas?.getContext('webgl2') || canvas?.getContext('webgl')).toBeTruthy();
  });
});
