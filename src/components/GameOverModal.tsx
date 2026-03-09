import { Trophy, Skull } from 'lucide-react';
import styles from './GameOverModal.module.css';

interface GameOverModalProps {
  isGameOver: boolean;
  isGameWon: boolean;
  time: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isGameOver,
  isGameWon,
  time,
  onRestart,
}) => {
  if (!isGameOver && !isGameWon) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={`${styles.icon} ${isGameWon ? styles.won : styles.lost}`}>
          {isGameWon ? <Trophy size={48} /> : <Skull size={48} />}
        </div>
        <h2 className={styles.title}>
          {isGameWon ? '恭喜获胜！' : '游戏结束'}
        </h2>
        <p className={styles.message}>
          {isGameWon
            ? `你成功排除了所有地雷！用时 ${formatTime(time)}`
            : '很遗憾，你踩到了地雷...'}
        </p>
        <button className={styles.button} onClick={onRestart}>
          再来一局
        </button>
      </div>
    </div>
  );
};
