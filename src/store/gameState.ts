import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { BlockType, GameState, GameActions, SavedBuild, Block } from './types';
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
  lastUpdateTimestamp: Date.now(),
  pendingHoverUpdates: false,
};

interface Vector3Like {
  x: number;
  y: number;
  z: number;
}

interface BlockLike {
  id: string;
  position: Vector3Like;
  type: BlockType;
  color: string;
}

// Helper function to convert plain objects to Vector3
const convertToVector3 = (obj: Vector3Like | Vector3): Vector3 => {
  if (obj instanceof Vector3) {
    return obj;
  }
  return new Vector3(obj.x, obj.y, obj.z);
};

// Helper function to convert blocks with Vector3 positions
const convertBlocksToVector3 = (blocks: BlockLike[]): Block[] => {
  return blocks.map((block) => ({
    ...block,
    position: convertToVector3(block.position),
  }));
};

// Debounce history updates to reduce storage operations
let historyUpdateTimeout: ReturnType<typeof setTimeout> | null = null;
const HISTORY_UPDATE_DELAY = 500; // 500ms debounce

// Throttle hover updates to reduce excessive state changes and re-renders
let hoverUpdateTimeout: ReturnType<typeof setTimeout> | null = null;
const HOVER_UPDATE_DELAY = 30; // 30ms throttle (about 33fps)

const store = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addBlock: (block) =>
        set(
          produce((state: GameState) => {
            const newBlock = { ...block, id: generateId() };
            state.blocks.push(newBlock);
            state.lastUpdateTimestamp = Date.now();

            // Debounce history updates
            if (historyUpdateTimeout) {
              clearTimeout(historyUpdateTimeout);
            }

            historyUpdateTimeout = setTimeout(() => {
              set(
                produce((state: GameState) => {
                  // Update history
                  state.history = state.history.slice(0, state.historyIndex + 1);
                  // Create a deep copy of the blocks array for history
                  state.history.push(JSON.parse(JSON.stringify(state.blocks)));
                  state.historyIndex++;
                })
              );
            }, HISTORY_UPDATE_DELAY);
          }),
          false // Use false for shallow merge to optimize updates
        ),

      removeBlock: (id) =>
        set(
          produce((state: GameState) => {
            state.blocks = state.blocks.filter((block) => block.id !== id);
            state.lastUpdateTimestamp = Date.now();

            // Debounce history updates
            if (historyUpdateTimeout) {
              clearTimeout(historyUpdateTimeout);
            }

            historyUpdateTimeout = setTimeout(() => {
              set(
                produce((state: GameState) => {
                  // Update history
                  state.history = state.history.slice(0, state.historyIndex + 1);
                  // Create a deep copy of the blocks array for history
                  state.history.push(JSON.parse(JSON.stringify(state.blocks)));
                  state.historyIndex++;
                })
              );
            }, HISTORY_UPDATE_DELAY);
          }),
          false // Use false for shallow merge to optimize updates
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

      // Throttled hover update function
      setHoveredBlock: (id: string | null) => {
        const state = get();

        if (state.hoveredBlockId === id) {
          return; // Skip if no change
        }

        // If we already have a pending update, just store the new target ID
        if (state.pendingHoverUpdates) {
          set({ hoveredBlockId: id }, false);
          return;
        }

        // Set pending flag
        set({ pendingHoverUpdates: true }, false);

        // Throttle rapid hover changes
        if (hoverUpdateTimeout) {
          clearTimeout(hoverUpdateTimeout);
        }

        hoverUpdateTimeout = setTimeout(() => {
          set({ hoveredBlockId: id, pendingHoverUpdates: false }, false);
        }, HOVER_UPDATE_DELAY);
      },

      setHoveredFace: (index: number | null) => {
        const state = get();

        if (state.hoveredFaceIndex === index) {
          return; // Skip if no change
        }

        set({ hoveredFaceIndex: index }, false);
      },

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
              const historyItem = state.history[state.historyIndex];
              if (historyItem) {
                state.blocks = convertBlocksToVector3(JSON.parse(JSON.stringify(historyItem)));
                state.lastUpdateTimestamp = Date.now();
              }
            }
          })
        ),

      redo: () =>
        set(
          produce((state: GameState) => {
            if (state.historyIndex < state.history.length - 1) {
              state.historyIndex++;
              const historyItem = state.history[state.historyIndex];
              if (historyItem) {
                state.blocks = convertBlocksToVector3(JSON.parse(JSON.stringify(historyItem)));
                state.lastUpdateTimestamp = Date.now();
              }
            }
          })
        ),

      saveBuild: (name: string) =>
        set(
          produce((state: GameState) => {
            const newBuild: SavedBuild = {
              id: generateId(),
              name,
              blocks: JSON.parse(JSON.stringify(state.blocks)), // Deep copy to prevent reference issues
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
              state.blocks = convertBlocksToVector3(JSON.parse(JSON.stringify(build.blocks)));
              state.history = [[...state.blocks]];
              state.historyIndex = 0;
              state.lastUpdateTimestamp = Date.now();
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
        const state = get();
        const build = state.savedBuilds.find((b: SavedBuild) => b.id === id);
        if (!build) return '';
        return btoa(JSON.stringify(build));
      },

      importBuild: (data: string) =>
        set(
          produce((state: GameState) => {
            try {
              const decodedData = atob(data);
              const build = JSON.parse(decodedData) as SavedBuild;
              build.blocks = convertBlocksToVector3(build.blocks);
              build.id = generateId();
              build.createdAt = Date.now();
              build.updatedAt = Date.now();
              state.savedBuilds.push(build);
            } catch (error) {
              console.error('Failed to import build:', error);
            }
          })
        ),

      clearBlocks: () =>
        set(
          produce((state: GameState) => {
            state.blocks = [];
            state.lastUpdateTimestamp = Date.now();

            // Update history
            state.history = state.history.slice(0, state.historyIndex + 1);
            state.history.push([]);
            state.historyIndex++;
          })
        ),
    }),
    {
      name: 'iso-builder-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        blocks: state.blocks,
        selectedBlockType: state.selectedBlockType,
        selectedColor: state.selectedColor,
        history: state.history,
        historyIndex: state.historyIndex,
        theme: state.theme,
        savedBuilds: state.savedBuilds,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert all Vector3 positions in blocks and history
          state.blocks = convertBlocksToVector3(state.blocks);
          state.history = state.history.map((blocks) => convertBlocksToVector3(blocks));
          state.savedBuilds = state.savedBuilds.map((build) => ({
            ...build,
            blocks: convertBlocksToVector3(build.blocks),
          }));
        }
      },
    }
  )
);

export const useGameStore = store;

// Custom selector hooks for better performance
export const useBlocks = () => {
  return useGameStore((state) => state.blocks);
};

export const useTheme = () => useGameStore((state) => state.theme);

export const useHoveredState = () => {
  return useGameStore((state) => ({
    hoveredBlockId: state.hoveredBlockId,
    hoveredFaceIndex: state.hoveredFaceIndex,
  }));
};
