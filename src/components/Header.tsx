import { Menu, RotateCcw, Smile, Frown, Trophy, Maximize, Minimize } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  time: number;
  flagsPlaced: number;
  mineCount: number;
  isGameOver: boolean;
  isGameWon: boolean;
  onReset: () => void;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  time,
  flagsPlaced,
  mineCount,
  isGameOver,
  isGameWon,
  onReset,
  onMenuClick,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('无法进入全屏模式:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getGameStatusIcon = () => {
    if (isGameWon) return <Trophy className={styles.statusIcon} />;
    if (isGameOver) return <Frown className={styles.statusIcon} />;
    return <Smile className={styles.statusIcon} />;
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuButton} onClick={onMenuClick} title="菜单">
          <Menu size={20} />
        </button>
        <h1 className={styles.title}>Mines</h1>
      </div>
      
      <div className={styles.center}>
        <button className={styles.resetButton} onClick={onReset} title="重新开始">
          {getGameStatusIcon()}
        </button>
      </div>
      
      <div className={styles.right}>
        <div className={styles.counter}>
          <span className={styles.counterLabel}>💣</span>
          <span className={styles.counterValue}>
            {Math.max(0, mineCount - flagsPlaced).toString().padStart(3, '0')}
          </span>
        </div>
        <div className={styles.counter}>
          <span className={styles.counterLabel}>⏱️</span>
          <span className={styles.counterValue}>{formatTime(time)}</span>
        </div>
        <button 
          className={styles.fullscreenButton} 
          onClick={toggleFullscreen} 
          title={isFullscreen ? "退出全屏" : "全屏"}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>
    </header>
  );
};
