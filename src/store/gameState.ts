import { create } from 'zustand';
import { produce } from 'immer';
import { BlockType, GameState, GameActions, SavedBuild } from './types';
import { Vector3 } from 'three';

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialState: GameState = {
  blocks: [],
  selectedBlockType: 'cube',
  selectedColor: '#ffffff',
  history: [[]],
  historyIndex: 0,
  hoveredBlockId: null,
  hoveredFaceIndex: null,
  theme: 'dark',
  savedBuilds: [],
};

const store = create<GameState & GameActions>((set) => ({
  ...initialState,

  addBlock: (block) =>
    set(
      produce((state: GameState) => {
        const newBlock = { ...block, id: generateId() };
        state.blocks.push(newBlock);

        // Update history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push([...state.blocks]);
        state.historyIndex++;
      })
    ),

  removeBlock: (id) =>
    set(
      produce((state: GameState) => {
        state.blocks = state.blocks.filter((block) => block.id !== id);

        // Update history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push([...state.blocks]);
        state.historyIndex++;
      })
    ),

  setSelectedBlockType: (type: BlockType) =>
    set(
      produce((state: GameState) => {
        state.selectedBlockType = type;
      })
    ),

  setSelectedColor: (color: string) =>
    set(
      produce((state: GameState) => {
        state.selectedColor = color;
      })
    ),

  setHoveredBlock: (id: string | null) =>
    set(
      produce((state: GameState) => {
        state.hoveredBlockId = id;
      })
    ),

  setHoveredFace: (index: number | null) =>
    set(
      produce((state: GameState) => {
        state.hoveredFaceIndex = index;
      })
    ),

  toggleTheme: () =>
    set(
      produce((state: GameState) => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
      })
    ),

  undo: () =>
    set(
      produce((state: GameState) => {
        if (state.historyIndex > 0) {
          state.historyIndex--;
          state.blocks = [...state.history[state.historyIndex]];
        }
      })
    ),

  redo: () =>
    set(
      produce((state: GameState) => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex++;
          state.blocks = [...state.history[state.historyIndex]];
        }
      })
    ),

  saveBuild: (name: string) =>
    set(
      produce((state: GameState) => {
        const newBuild: SavedBuild = {
          id: generateId(),
          name,
          blocks: [...state.blocks],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        state.savedBuilds.push(newBuild);
      })
    ),

  loadBuild: (id: string) =>
    set(
      produce((state: GameState) => {
        const build = state.savedBuilds.find((b) => b.id === id);
        if (build) {
          // Create new Vector3 instances for each block's position
          state.blocks = build.blocks.map((block) => ({
            ...block,
            position: new Vector3(block.position.x, block.position.y, block.position.z),
          }));
          state.history = [[...state.blocks]];
          state.historyIndex = 0;
        }
      })
    ),

  deleteBuild: (id: string) =>
    set(
      produce((state: GameState) => {
        state.savedBuilds = state.savedBuilds.filter((build) => build.id !== id);
      })
    ),

  exportBuild: (id: string): string => {
    const state = store.getState();
    const build = state.savedBuilds.find((b: SavedBuild) => b.id === id);
    if (!build) return '';
    return JSON.stringify(build);
  },

  importBuild: (data: string) =>
    set(
      produce((state: GameState) => {
        try {
          const build = JSON.parse(data) as SavedBuild;
          // Create new Vector3 instances for each block's position
          build.blocks = build.blocks.map((block) => ({
            ...block,
            position: new Vector3(block.position.x, block.position.y, block.position.z),
          }));
          build.id = generateId();
          build.createdAt = Date.now();
          build.updatedAt = Date.now();
          state.savedBuilds.push(build);
        } catch (error) {
          console.error('Failed to import build:', error);
        }
      })
    ),
}));

export const useGameStore = store;
