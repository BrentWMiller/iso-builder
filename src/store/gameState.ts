import { create } from 'zustand';
import { produce } from 'immer';
import { Vector3 } from 'three';
import { Block, BlockType, GameState, GameActions } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialState: GameState = {
  blocks: [],
  selectedBlockType: 'cube',
  selectedColor: '#ffffff',
  history: [[]],
  historyIndex: 0,
};

export const useGameStore = create<GameState & GameActions>((set) => ({
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
}));
