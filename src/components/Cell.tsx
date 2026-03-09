import { Flag } from 'lucide-react';
import type { Cell as CellType } from '../types';
import styles from './Cell.module.css';

interface CellProps {
  cell: CellType;
  size: number;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const MineIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="6" />
    <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="2" />
    <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="2" />
    <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="2" />
    <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" stroke="currentColor" strokeWidth="2" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="2" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" stroke="currentColor" strokeWidth="2" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const Cell: React.FC<CellProps> = ({
  cell,
  size,
  onClick,
  onContextMenu,
}) => {
  const getCellClassName = (): string => {
    const classes = [styles.cell];
    
    if (cell.isRevealed) {
      classes.push(styles.revealed);
      if (cell.isExploded) {
        classes.push(styles.exploded);
      } else if (cell.isMine) {
        classes.push(styles.mine);
      }
    } else if (cell.isFlagged) {
      classes.push(styles.flagged);
    }
    
    return classes.join(' ');
  };

  const getNumberColor = (num: number): string => {
    const colors: Record<number, string> = {
      1: 'var(--number-1)',
      2: 'var(--number-2)',
      3: 'var(--number-3)',
      4: 'var(--number-4)',
      5: 'var(--number-5)',
      6: 'var(--number-6)',
      7: 'var(--number-7)',
      8: 'var(--number-8)',
    };
    return colors[num] || 'var(--text-primary)';
  };

  const renderContent = () => {
    if (cell.isRevealed) {
      if (cell.isMine) {
        return <MineIcon size={size} />;
      }
      if (cell.neighborCount > 0) {
        return (
          <span
            className={styles.number}
            style={{ color: getNumberColor(cell.neighborCount), fontSize: size * 0.55 }}
          >
            {cell.neighborCount}
          </span>
        );
      }
      return null;
    }
    
    if (cell.isFlagged) {
      return <Flag size={size * 0.5} className={styles.flagIcon} />;
    }
    
    return null;
  };

  return (
    <div
      className={getCellClassName()}
      style={{ width: size, height: size }}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {renderContent()}
    </div>
  );
};
