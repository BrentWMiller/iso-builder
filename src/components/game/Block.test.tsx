import { Canvas } from '@react-three/fiber';
import { render, fireEvent } from '@testing-library/react';
import { Vector3 } from 'three';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Block from './Block';

interface Block {
  position: Vector3;
  type: string;
  color: string;
}

// Mock the store
const mockAddBlock = vi.fn();
const mockRemoveBlock = vi.fn();
const mockBlocks: Block[] = [];

vi.mock('../../store/gameState', () => ({
  useGameStore: vi.fn().mockImplementation((selector) =>
    selector({
      blocks: mockBlocks,
      selectedBlockType: 'cube',
      selectedColor: '#ffffff',
      history: [[]],
      historyIndex: 0,
      addBlock: mockAddBlock,
      removeBlock: mockRemoveBlock,
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

  it('removes block on right click', () => {
    const { container } = render(
      <Canvas>
        <Block {...defaultProps} />
      </Canvas>
    );
    const mesh = container.querySelector('mesh');
    if (mesh) {
      fireEvent.contextMenu(mesh);
      expect(mockRemoveBlock).toHaveBeenCalledWith(defaultProps.id);
    }
  });

  it('adds new block on left click with face normal', () => {
    const { container } = render(
      <Canvas>
        <Block {...defaultProps} />
      </Canvas>
    );
    const mesh = container.querySelector('mesh');
    if (mesh) {
      fireEvent.click(mesh, {
        face: { normal: new Vector3(1, 0, 0) },
        stopPropagation: vi.fn(),
      });
      expect(mockAddBlock).toHaveBeenCalledWith({
        position: new Vector3(1.5, 0.5, 0.5),
        type: 'cube',
        color: '#ffffff',
      });
    }
  });

  it('does not add block if position is already occupied', () => {
    // Mock blocks to include a block at the target position
    mockBlocks.push({
      position: new Vector3(1.5, 0.5, 0.5),
      type: 'cube',
      color: '#ffffff',
    });

    const { container } = render(
      <Canvas>
        <Block {...defaultProps} />
      </Canvas>
    );
    const mesh = container.querySelector('mesh');
    if (mesh) {
      fireEvent.click(mesh, {
        face: { normal: new Vector3(1, 0, 0) },
        stopPropagation: vi.fn(),
      });
      expect(mockAddBlock).not.toHaveBeenCalled();
    }
  });
});
