import { useEffect, useState, useRef } from 'react';
import { Header, Grid, DifficultySelector, GameOverModal } from './components';
import { useGameStore } from './store/useGameStore';
import type { Difficulty, DifficultyConfig } from './types';
import './styles/variables.css';
import styles from './App.module.css';

const DIFFICULTY_PRESETS: Record<Exclude<Difficulty, 'custom'>, DifficultyConfig> = {
  easy: { rows: 8, cols: 8, mineCount: 10 },
  medium: { rows: 16, cols: 16, mineCount: 40 },
  hard: { rows: 16, cols: 30, mineCount: 99 },
};

function App() {
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('medium');
  
  const {
    grid,
    mineCount,
    flagsPlaced,
    isGameOver,
    isGameWon,
    time,
    isPlaying,
    startGame,
    revealCell,
    toggleFlag,
    chordCell,
    resetGame,
    tick,
  } = useGameStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const config = DIFFICULTY_PRESETS.medium;
    startGame(config.rows, config.cols, config.mineCount);
  }, [startGame]);

  useEffect(() => {
    if (isPlaying && !isGameOver && !isGameWon) {
      timerRef.current = setInterval(tick, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, isGameOver, isGameWon, tick]);

  const handleDifficultySelect = (difficulty: Difficulty, config: DifficultyConfig) => {
    setCurrentDifficulty(difficulty);
    startGame(config.rows, config.cols, config.mineCount);
  };

  const handleReset = () => {
    resetGame();
  };

  return (
    <div className={styles.app}>
      <Header
        time={time}
        flagsPlaced={flagsPlaced}
        mineCount={mineCount}
        isGameOver={isGameOver}
        isGameWon={isGameWon}
        onReset={handleReset}
        onMenuClick={() => setShowDifficultySelector(true)}
      />
      
      <main className={styles.main}>
        <Grid
          grid={grid}
          onReveal={revealCell}
          onToggleFlag={toggleFlag}
          onChord={chordCell}
        />
      </main>

      <DifficultySelector
        currentDifficulty={currentDifficulty}
        onSelect={handleDifficultySelect}
        onClose={() => setShowDifficultySelector(false)}
        isOpen={showDifficultySelector}
      />

      <GameOverModal
        isGameOver={isGameOver}
        isGameWon={isGameWon}
        time={time}
        onRestart={handleReset}
      />
    </div>
  );
}

export default App;
