import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from './ThemeToggle';
import { useGameStore } from '../../store/gameState';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: React.ComponentProps<'button'>) => React.createElement('button', props, children),
    svg: ({ children, ...props }: React.ComponentProps<'svg'>) => React.createElement('svg', props, children),
  },
}));

// Mock the useGameStore hook
vi.mock('../../store/gameState', () => ({
  useGameStore: vi.fn(),
}));

describe('ThemeToggle', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementation
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      if (selector.toString().includes('theme')) {
        return 'dark'; // Default theme
      }
      if (selector.toString().includes('toggleTheme')) {
        return mockToggleTheme;
      }
      return null;
    });
  });

  it('renders the moon icon when in dark mode', () => {
    render(<ThemeToggle />);

    // Check if the moon icon is rendered (dark theme icon)
    const moonIcon = screen.getByTestId('moon-icon');
    expect(moonIcon).toBeInTheDocument();
  });

  it('renders the sun icon when in light mode', () => {
    // Mock light theme
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      if (selector.toString().includes('theme')) {
        return 'light';
      }
      if (selector.toString().includes('toggleTheme')) {
        return mockToggleTheme;
      }
      return null;
    });

    render(<ThemeToggle />);

    // Check if the sun icon is rendered (light theme icon)
    const sunIcon = screen.getByTestId('sun-icon');
    expect(sunIcon).toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('has the correct accessibility attributes', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
  });

  it('has the correct styling classes', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('fixed');
    expect(button).toHaveClass('top-4');
    expect(button).toHaveClass('right-4');
    expect(button).toHaveClass('size-10');
  });
});
