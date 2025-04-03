import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Scene from './Scene';
import { useGameStore } from '../../store/gameState';
import { GameState } from '../../store/types';

// Mock the useGameStore hook
vi.mock('../../store/gameState', () => ({
  useGameStore: vi.fn(),
}));

// Mock @react-three/drei components
vi.mock('@react-three/drei', async () => {
  const actual = await vi.importActual('@react-three/drei');
  return {
    ...actual,
    SoftShadows: () => <div data-testid='soft-shadows' />,
    OrbitControls: () => <div data-testid='orbit-controls' />,
    Grid: () => <div data-testid='grid' />,
  };
});

// Mock @react-three/fiber
vi.mock('@react-three/fiber', async () => {
  const actual = await vi.importActual('@react-three/fiber');
  return {
    ...actual,
    Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid='canvas'>{children}</div>,
    useThree: () => ({
      camera: {},
      scene: {},
    }),
    extend: () => {}, // Mock the extend function
  };
});

// Mock the SoftCirclePlane component
vi.mock('./SoftCirclePlane', () => ({
  default: () => <div data-testid='soft-circle-plane' />,
}));

describe('Scene Component', () => {
  const mockBlocks = [
    { id: '1', position: { x: 0, y: 0, z: 0 }, type: 'cube', color: '#ff0000' },
    { id: '2', position: { x: 1, y: 0, z: 1 }, type: 'cube', color: '#00ff00' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: (state: GameState) => unknown) => {
      if (selector.toString().includes('blocks')) {
        return mockBlocks;
      }
      if (selector.toString().includes('theme')) {
        return 'dark';
      }
      return null;
    });
  });

  it('renders without crashing', () => {
    render(<Scene />);
  });

  it('renders with correct canvas container', () => {
    const { getByTestId } = render(<Scene />);
    const container = getByTestId('canvas');
    expect(container).toBeInTheDocument();
  });

  it('renders the soft shadows component', () => {
    const { getByTestId } = render(<Scene />);
    expect(getByTestId('soft-shadows')).toBeInTheDocument();
  });

  it('renders the grid', () => {
    const { getByTestId } = render(<Scene />);
    expect(getByTestId('grid')).toBeInTheDocument();
  });

  it('renders orbit controls', () => {
    const { getByTestId } = render(<Scene />);
    expect(getByTestId('orbit-controls')).toBeInTheDocument();
  });

  it('renders lighting elements', () => {
    const { container } = render(<Scene />);
    expect(container.querySelector('ambientlight')).toBeInTheDocument();
    expect(container.querySelectorAll('directionallight')).toHaveLength(2);
  });
});
