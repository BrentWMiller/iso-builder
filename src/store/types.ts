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
}

export interface GameActions {
  addBlock: (block: Omit<Block, 'id'>) => void;
  removeBlock: (id: string) => void;
  setSelectedBlockType: (type: BlockType) => void;
  setSelectedColor: (color: string) => void;
  undo: () => void;
  redo: () => void;
}
