import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BuildManager from '../BuildManager';
import { useGameStore } from '../../../store/gameState';
import { SavedBuild, Block } from '../../../store/types';
import { Vector3 } from 'three';
import React from 'react';

// Mock UI components
vi.mock('../../../components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
}));

vi.mock('../../../components/ui/input', () => ({
  Input: ({ ...props }: React.ComponentProps<'input'>) => <input {...props} />,
}));

vi.mock('../../../components/ui/textarea', () => ({
  Textarea: ({ ...props }: React.ComponentProps<'textarea'>) => <textarea {...props} />,
}));

vi.mock('../../../components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid='dropdown-menu'>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid='dropdown-trigger'>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div data-testid='dropdown-content'>{children}</div>,
  DropdownMenuItem: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div {...props} data-testid='dropdown-item'>
      {children}
    </div>
  ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Menu: () => <div data-testid='menu-icon' />,
  Save: () => <div data-testid='save-icon' />,
  Upload: () => <div data-testid='upload-icon' />,
  Download: () => <div data-testid='download-icon' />,
  Copy: () => <div data-testid='copy-icon' />,
  Trash2: () => <div data-testid='trash-icon' />,
  X: () => <div data-testid='x-icon' />,
}));

// Mock the game store
vi.mock('../../../store/gameState', () => ({
  useGameStore: vi.fn(),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('BuildManager', () => {
  const mockBlocks: Block[] = [
    { id: '1', position: new Vector3(0, 0, 0), type: 'cube', color: '#ff0000' },
    { id: '2', position: new Vector3(1, 0, 1), type: 'cube', color: '#00ff00' },
  ];

  const mockSavedBuilds: SavedBuild[] = [
    {
      id: '1',
      name: 'Test Build 1',
      blocks: mockBlocks,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: '2',
      name: 'Test Build 2',
      blocks: mockBlocks,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  const mockStore = {
    savedBuilds: mockSavedBuilds,
    saveBuild: vi.fn(),
    loadBuild: vi.fn(),
    deleteBuild: vi.fn(),
    exportBuild: vi.fn(),
    importBuild: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useGameStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => {
      if (selector.toString().includes('savedBuilds')) {
        return mockSavedBuilds;
      }
      if (selector.toString().includes('saveBuild')) {
        return mockStore.saveBuild;
      }
      if (selector.toString().includes('loadBuild')) {
        return mockStore.loadBuild;
      }
      if (selector.toString().includes('deleteBuild')) {
        return mockStore.deleteBuild;
      }
      if (selector.toString().includes('exportBuild')) {
        return mockStore.exportBuild;
      }
      if (selector.toString().includes('importBuild')) {
        return mockStore.importBuild;
      }
      return null;
    });
  });

  it('renders the build manager button', () => {
    render(<BuildManager />);
    expect(screen.getByText('Builds')).toBeInTheDocument();
  });

  it('opens and closes the build manager panel', async () => {
    render(<BuildManager />);
    const button = screen.getByText('Builds');

    // Open panel
    fireEvent.click(button);
    expect(screen.getByText('Saved Builds')).toBeInTheDocument();

    // Close panel
    fireEvent.click(button);
    expect(screen.queryByText('Saved Builds')).not.toBeInTheDocument();
  });

  it('saves a new build', async () => {
    render(<BuildManager />);
    fireEvent.click(screen.getByText('Builds'));

    const input = screen.getByPlaceholderText('Build name');
    const saveButton = screen.getByText('Save');

    // Enter build name and save
    await fireEvent.change(input, { target: { value: 'New Test Build' } });
    fireEvent.click(saveButton);

    expect(mockStore.saveBuild).toHaveBeenCalledWith('New Test Build');
    expect(input).toHaveValue('');
  });

  it('loads a saved build', async () => {
    render(<BuildManager />);
    fireEvent.click(screen.getByText('Builds'));

    // Open dropdown menu for first build
    const menuButtons = screen.getAllByRole('button', { name: '' });
    const menuButton = menuButtons[0];
    if (menuButton) {
      fireEvent.click(menuButton);

      // Click load build option - use getAllByText and get the first one
      const loadButtons = screen.getAllByText('Load Build');
      if (loadButtons[0]) {
        fireEvent.click(loadButtons[0]);

        expect(mockStore.loadBuild).toHaveBeenCalledWith('1');
      }
    }
  });

  it('deletes a build', async () => {
    render(<BuildManager />);
    fireEvent.click(screen.getByText('Builds'));

    // Open dropdown menu for first build
    const menuButtons = screen.getAllByRole('button', { name: '' });
    const menuButton = menuButtons[0];
    if (menuButton) {
      fireEvent.click(menuButton);

      // Click delete build option - use getAllByText and get the first one
      const deleteButtons = screen.getAllByText('Delete Build');
      if (deleteButtons[0]) {
        fireEvent.click(deleteButtons[0]);

        expect(mockStore.deleteBuild).toHaveBeenCalledWith('1');
      }
    }
  });

  it('copies build data to clipboard', async () => {
    const mockExportData = 'test-build-data';
    mockStore.exportBuild.mockReturnValue(mockExportData);

    render(<BuildManager />);
    fireEvent.click(screen.getByText('Builds'));

    // Open dropdown menu for first build
    const menuButtons = screen.getAllByRole('button', { name: '' });
    const menuButton = menuButtons[0];
    if (menuButton) {
      fireEvent.click(menuButton);

      // Click copy build data option - use getAllByText and get the first one
      const copyButtons = screen.getAllByText('Copy Build Data');
      if (copyButtons[0]) {
        fireEvent.click(copyButtons[0]);

        expect(mockStore.exportBuild).toHaveBeenCalledWith('1');
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockExportData);
      }
    }
  });

  it('imports a build', async () => {
    // Mock importBuild to resolve successfully
    mockStore.importBuild.mockImplementation(() => {});

    render(<BuildManager />);
    fireEvent.click(screen.getByText('Builds'));

    // Click import button to show import form
    const importButton = screen.getByText('Import Build');
    fireEvent.click(importButton);

    // Wait for import form to be visible
    const textarea = await screen.findByPlaceholderText('Paste build data here');

    // Enter valid JSON data
    const validJsonData = JSON.stringify({ name: 'Test Build', blocks: [] });
    await fireEvent.change(textarea, { target: { value: validJsonData } });

    // Submit the form
    const form = screen.getByTestId('import-form');
    fireEvent.submit(form);

    // Verify import was called with the base64 encoded data
    expect(mockStore.importBuild).toHaveBeenCalledWith(btoa(validJsonData));

    // Click import button again to show the form
    fireEvent.click(importButton);

    // Wait for import form to be visible again
    const newTextarea = await screen.findByPlaceholderText('Paste build data here');

    // Verify form is reset
    expect(newTextarea).toHaveValue('');
  });

  it('handles invalid import data gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<BuildManager />);
    fireEvent.click(screen.getByText('Builds'));

    // Open import section
    const importButton = screen.getByText('Import Build');
    fireEvent.click(importButton);

    // Enter invalid import data
    const textarea = screen.getByPlaceholderText('Paste build data here');
    await fireEvent.change(textarea, { target: { value: 'invalid-data' } });

    // Submit import
    const submitButton = screen.getByText('Import');
    fireEvent.click(submitButton);

    expect(consoleSpy).toHaveBeenCalled();
    expect(mockStore.importBuild).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
