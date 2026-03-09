import { useRef, useEffect, useState } from 'react';
import { Cell } from './Cell';
import type { Cell as CellType } from '../types';
import styles from './Grid.module.css';

interface GridProps {
  grid: CellType[][];
  onReveal: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
}

export const Grid: React.FC<GridProps> = ({
  grid,
  onReveal,
  onToggleFlag,
  onChord,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(32);

  useEffect(() => {
    const calculateCellSize = () => {
      if (!containerRef.current || grid.length === 0) return;

      const container = containerRef.current;
      const maxWidth = container.clientWidth - 20;
      const maxHeight = window.innerHeight - 200;

      const rows = grid.length;
      const cols = grid[0]?.length || 1;

      const maxCellWidth = Math.floor(maxWidth / cols);
      const maxCellHeight = Math.floor(maxHeight / rows);

      const optimalSize = Math.min(maxCellWidth, maxCellHeight, 40);
      setCellSize(Math.max(optimalSize, 20));
    };

    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);
    
    return () => {
      window.removeEventListener('resize', calculateCellSize);
    };
  }, [grid]);

  if (grid.length === 0) {
    return (
      <div className={styles.empty}>
        <p>选择难度开始游戏</p>
      </div>
    );
  }

  const rows = grid.length;
  const cols = grid[0].length;

  const handleCellClick = (row: number, col: number) => {
    const cell = grid[row][col];
    
    if (cell.isRevealed && cell.neighborCount > 0) {
      onChord(row, col);
    } else {
      onReveal(row, col);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              size={cellSize}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onContextMenu={(e) => {
                e.preventDefault();
                onToggleFlag(rowIndex, colIndex);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};
