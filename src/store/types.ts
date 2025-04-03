import { Vector3 } from 'three';

export type BlockType = 'cube' | 'stair' | 'slab';

export interface Block {
  id: string;
  position: Vector3;
  type: BlockType;
  color: string;
}

export interface GameState {
  blocks: Block[];
  selectedBlockType: BlockType;
  selectedColor: string;
  history: Block[][];
  historyIndex: number;
  hoveredBlockId: string | null;
  hoveredFaceIndex: number | null;
  theme: 'light' | 'dark';
}

export interface GameActions {
  addBlock: (block: Omit<Block, 'id'>) => void;
  removeBlock: (id: string) => void;
  setSelectedBlockType: (type: BlockType) => void;
  setSelectedColor: (color: string) => void;
  setHoveredBlock: (id: string | null) => void;
  setHoveredFace: (index: number | null) => void;
  toggleTheme: () => void;
  undo: () => void;
  redo: () => void;
}
