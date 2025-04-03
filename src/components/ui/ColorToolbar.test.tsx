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
    expect(buttons).toHaveLength(12); // We have 12 colors
  });

  it('displays the correct colors', () => {
    render(<ColorToolbar />);

    // Check if each color is present
    const whiteButton = screen.getByLabelText('Select White color');
    const coralButton = screen.getByLabelText('Select Coral color');
    const turquoiseButton = screen.getByLabelText('Select Turquoise color');
    const skyBlueButton = screen.getByLabelText('Select Sky Blue color');
    const mintButton = screen.getByLabelText('Select Mint color');
    const creamButton = screen.getByLabelText('Select Cream color');

    expect(whiteButton).toHaveStyle({ backgroundColor: '#ffffff' });
    expect(coralButton).toHaveStyle({ backgroundColor: '#FF6B6B' });
    expect(turquoiseButton).toHaveStyle({ backgroundColor: '#4ECDC4' });
    expect(skyBlueButton).toHaveStyle({ backgroundColor: '#45B7D1' });
    expect(mintButton).toHaveStyle({ backgroundColor: '#96CEB4' });
    expect(creamButton).toHaveStyle({ backgroundColor: '#FFEEAD' });
  });

  it('highlights the selected color', () => {
    // Mock the selected color as coral
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: (state: GameState) => unknown) => {
      if (selector.toString().includes('selectedColor')) {
        return '#FF6B6B'; // Selected color is coral
      }
      if (selector.toString().includes('setSelectedColor')) {
        return mockSetSelectedColor;
      }
      return null;
    });

    render(<ColorToolbar />);

    // Check if the coral button has the selected styling
    const coralButton = screen.getByLabelText('Select Coral color');
    expect(coralButton).toHaveClass('ring-2');
    expect(coralButton).toHaveClass('scale-105');

    // Check if other buttons don't have the selected styling
    const whiteButton = screen.getByLabelText('Select White color');
    expect(whiteButton).not.toHaveClass('ring-2');
    expect(whiteButton).not.toHaveClass('scale-105');
  });

  it('calls setSelectedColor when a color button is clicked', () => {
    render(<ColorToolbar />);

    // Click on the turquoise button
    const turquoiseButton = screen.getByLabelText('Select Turquoise color');
    fireEvent.click(turquoiseButton);

    // Check if setSelectedColor was called with the correct color
    expect(mockSetSelectedColor).toHaveBeenCalledWith('#4ECDC4');
  });

  it('has the correct accessibility attributes', () => {
    render(<ColorToolbar />);

    // Check if each button has the correct aria-label
    expect(screen.getByLabelText('Select White color')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Coral color')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Turquoise color')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Sky Blue color')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Mint color')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Cream color')).toBeInTheDocument();
  });
});
