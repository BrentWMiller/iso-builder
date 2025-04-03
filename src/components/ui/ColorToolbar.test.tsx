import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ColorToolbar from './ColorToolbar';
import { useGameStore } from '../../store/gameState';
import { GameState } from '../../store/types';

// Mock the useGameStore hook
vi.mock('../../store/gameState', () => ({
  useGameStore: vi.fn(),
}));

describe('ColorToolbar', () => {
  const mockSetSelectedColor = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementation
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: (state: GameState) => unknown) => {
      if (selector.toString().includes('selectedColor')) {
        return '#ffffff'; // Default selected color
      }
      if (selector.toString().includes('setSelectedColor')) {
        return mockSetSelectedColor;
      }
      return null;
    });
  });

  it('renders all color buttons', () => {
    render(<ColorToolbar />);

    // Check if all color buttons are rendered
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6); // We have 6 colors
  });

  it('displays the correct colors', () => {
    render(<ColorToolbar />);

    // Check if each color is present
    const whiteButton = screen.getByLabelText('Select White color');
    const redButton = screen.getByLabelText('Select Red color');
    const greenButton = screen.getByLabelText('Select Green color');
    const blueButton = screen.getByLabelText('Select Blue color');
    const yellowButton = screen.getByLabelText('Select Yellow color');
    const magentaButton = screen.getByLabelText('Select Magenta color');

    expect(whiteButton).toHaveStyle({ backgroundColor: '#ffffff' });
    expect(redButton).toHaveStyle({ backgroundColor: '#ff0000' });
    expect(greenButton).toHaveStyle({ backgroundColor: '#00ff00' });
    expect(blueButton).toHaveStyle({ backgroundColor: '#0000ff' });
    expect(yellowButton).toHaveStyle({ backgroundColor: '#ffff00' });
    expect(magentaButton).toHaveStyle({ backgroundColor: '#ff00ff' });
  });

  it('highlights the selected color', () => {
    // Mock the selected color as red
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: (state: GameState) => unknown) => {
      if (selector.toString().includes('selectedColor')) {
        return '#ff0000'; // Selected color is red
      }
      if (selector.toString().includes('setSelectedColor')) {
        return mockSetSelectedColor;
      }
      return null;
    });

    render(<ColorToolbar />);

    // Check if the red button has the selected styling
    const redButton = screen.getByLabelText('Select Red color');
    expect(redButton).toHaveClass('ring-2');
    expect(redButton).toHaveClass('scale-105');

    // Check if other buttons don't have the selected styling
    const whiteButton = screen.getByLabelText('Select White color');
    expect(whiteButton).not.toHaveClass('ring-2');
    expect(whiteButton).not.toHaveClass('scale-105');
  });

  it('calls setSelectedColor when a color button is clicked', () => {
    render(<ColorToolbar />);

    // Click on the blue button
    const blueButton = screen.getByLabelText('Select Blue color');
    fireEvent.click(blueButton);

    // Check if setSelectedColor was called with the correct color
    expect(mockSetSelectedColor).toHaveBeenCalledWith('#0000ff');
  });

  it('has the correct accessibility attributes', () => {
    render(<ColorToolbar />);

    // Check if each button has the correct aria-label
    expect(screen.getByLabelText('Select White color')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Red color')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Green color')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Blue color')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Yellow color')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Magenta color')).toBeInTheDocument();
  });
});
