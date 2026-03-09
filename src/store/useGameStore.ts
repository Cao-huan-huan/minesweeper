import { create } from 'zustand';
import type { Cell, GameStore } from '../types';

const createEmptyGrid = (rows: number, cols: number): Cell[][] => {
  const grid: Cell[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        row: i,
        col: j,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborCount: 0,
        isExploded: false,
      });
    }
    grid.push(row);
  }
  return grid;
};

const placeMines = (
  grid: Cell[][],
  mineCount: number,
  safeRow: number,
  safeCol: number
): Cell[][] => {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  
  const isSafeZone = (r: number, c: number): boolean => {
    return Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1;
  };

  let placed = 0;
  const maxAttempts = rows * cols * 10;
  let attempts = 0;

  while (placed < mineCount && attempts < maxAttempts) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    
    if (!newGrid[r][c].isMine && !isSafeZone(r, c)) {
      newGrid[r][c].isMine = true;
      placed++;
    }
    attempts++;
  }

  return newGrid;
};

const calculateNeighborCounts = (grid: Cell[][]): Cell[][] => {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!newGrid[i][j].isMine) {
        let count = 0;
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di;
            const nj = j + dj;
            if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && newGrid[ni][nj].isMine) {
              count++;
            }
          }
        }
        newGrid[i][j].neighborCount = count;
      }
    }
  }

  return newGrid;
};

const revealCellRecursive = (grid: Cell[][], row: number, col: number): Cell[][] => {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

  const reveal = (r: number, c: number) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (newGrid[r][c].isRevealed || newGrid[r][c].isFlagged) return;
    
    newGrid[r][c].isRevealed = true;
    
    if (newGrid[r][c].neighborCount === 0 && !newGrid[r][c].isMine) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          reveal(r + di, c + dj);
        }
      }
    }
  };

  reveal(row, col);
  return newGrid;
};

const countFlagsAround = (grid: Cell[][], row: number, col: number): number => {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      const ni = row + di;
      const nj = col + dj;
      if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && grid[ni][nj].isFlagged) {
        count++;
      }
    }
  }
  
  return count;
};

const checkWin = (grid: Cell[][]): boolean => {
  for (const row of grid) {
    for (const cell of row) {
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
};

export const useGameStore = create<GameStore>((set, get) => ({
  grid: [],
  rows: 0,
  cols: 0,
  mineCount: 0,
  flagsPlaced: 0,
  isGameOver: false,
  isGameWon: false,
  isFirstClick: true,
  time: 0,
  isPlaying: false,

  startGame: (rows: number, cols: number, mineCount: number) => {
    const grid = createEmptyGrid(rows, cols);
    set({
      grid,
      rows,
      cols,
      mineCount,
      flagsPlaced: 0,
      isGameOver: false,
      isGameWon: false,
      isFirstClick: true,
      time: 0,
      isPlaying: false,
    });
  },

  revealCell: (row: number, col: number) => {
    const state = get();
    if (state.isGameOver || state.isGameWon) return;
    
    let newGrid = state.grid.map(r => r.map(c => ({ ...c })));
    
    if (newGrid[row][col].isFlagged || newGrid[row][col].isRevealed) return;

    if (state.isFirstClick) {
      newGrid = placeMines(newGrid, state.mineCount, row, col);
      newGrid = calculateNeighborCounts(newGrid);
      set({ isFirstClick: false, isPlaying: true });
    }

    if (newGrid[row][col].isMine) {
      newGrid[row][col].isExploded = true;
      for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[0].length; j++) {
          newGrid[i][j].isRevealed = true;
        }
      }
      set({
        grid: newGrid,
        isGameOver: true,
        isPlaying: false,
      });
      return;
    }

    newGrid = revealCellRecursive(newGrid, row, col);
    
    const won = checkWin(newGrid);
    
    set({
      grid: newGrid,
      isGameWon: won,
      isPlaying: !won,
    });
  },

  toggleFlag: (row: number, col: number) => {
    const state = get();
    if (state.isGameOver || state.isGameWon) return;
    
    const cell = state.grid[row][col];
    if (cell.isRevealed) return;

    const newGrid = state.grid.map(r => r.map(c => ({ ...c })));
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
    
    const flagsPlaced = state.flagsPlaced + (newGrid[row][col].isFlagged ? 1 : -1);
    
    set({ grid: newGrid, flagsPlaced });
  },

  chordCell: (row: number, col: number) => {
    const state = get();
    if (state.isGameOver || state.isGameWon) return;
    
    const cell = state.grid[row][col];
    if (!cell.isRevealed || cell.neighborCount === 0) return;

    const flagsAround = countFlagsAround(state.grid, row, col);
    if (flagsAround !== cell.neighborCount) return;

    let newGrid = state.grid.map(r => r.map(c => ({ ...c })));
    const rows = newGrid.length;
    const cols = newGrid[0].length;
    let hitMine = false;

    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        const ni = row + di;
        const nj = col + dj;
        if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
          const neighbor = newGrid[ni][nj];
          if (!neighbor.isRevealed && !neighbor.isFlagged) {
            if (neighbor.isMine) {
              neighbor.isExploded = true;
              hitMine = true;
            }
            newGrid = revealCellRecursive(newGrid, ni, nj);
          }
        }
      }
    }

    if (hitMine) {
      for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[0].length; j++) {
          newGrid[i][j].isRevealed = true;
        }
      }
      set({
        grid: newGrid,
        isGameOver: true,
        isPlaying: false,
      });
      return;
    }

    const won = checkWin(newGrid);
    set({
      grid: newGrid,
      isGameWon: won,
      isPlaying: !won,
    });
  },

  resetGame: () => {
    const state = get();
    if (state.rows > 0 && state.cols > 0) {
      const grid = createEmptyGrid(state.rows, state.cols);
      set({
        grid,
        flagsPlaced: 0,
        isGameOver: false,
        isGameWon: false,
        isFirstClick: true,
        time: 0,
        isPlaying: false,
      });
    }
  },

  tick: () => {
    set(state => ({ time: state.time + 1 }));
  },
}));
