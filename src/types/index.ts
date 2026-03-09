export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
  isExploded: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'custom';

export interface DifficultyConfig {
  rows: number;
  cols: number;
  mineCount: number;
}

export interface GameState {
  grid: Cell[][];
  rows: number;
  cols: number;
  mineCount: number;
  flagsPlaced: number;
  isGameOver: boolean;
  isGameWon: boolean;
  isFirstClick: boolean;
  time: number;
  isPlaying: boolean;
}

export interface GameActions {
  startGame: (rows: number, cols: number, mineCount: number) => void;
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  chordCell: (row: number, col: number) => void;
  resetGame: () => void;
  tick: () => void;
}

export type GameStore = GameState & GameActions;
