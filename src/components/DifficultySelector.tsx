import { useState } from 'react';
import { Settings, X, Check } from 'lucide-react';
import type { Difficulty, DifficultyConfig } from '../types';
import styles from './DifficultySelector.module.css';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty, config: DifficultyConfig) => void;
  onClose: () => void;
  isOpen: boolean;
}

const DIFFICULTY_PRESETS: Record<Difficulty, DifficultyConfig> = {
  easy: { rows: 8, cols: 8, mineCount: 10 },
  medium: { rows: 16, cols: 16, mineCount: 40 },
  hard: { rows: 16, cols: 30, mineCount: 99 },
  custom: { rows: 16, cols: 30, mineCount: 99 },
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelect,
  onClose,
  isOpen,
}) => {
  const [customConfig, setCustomConfig] = useState<DifficultyConfig>({
    rows: 16,
    cols: 30,
    mineCount: 99,
  });

  const handleSelect = (difficulty: Difficulty) => {
    if (difficulty === 'custom') {
      onSelect('custom', customConfig);
    } else {
      onSelect(difficulty, DIFFICULTY_PRESETS[difficulty]);
    }
    onClose();
  };

  const handleCustomChange = (field: keyof DifficultyConfig, value: number) => {
    const newConfig = { ...customConfig, [field]: value };
    const maxMines = Math.floor(newConfig.rows * newConfig.cols * 0.8);
    newConfig.mineCount = Math.min(newConfig.mineCount, maxMines);
    setCustomConfig(newConfig);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>选择难度</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.options}>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              className={`${styles.option} ${currentDifficulty === diff ? styles.active : ''}`}
              onClick={() => handleSelect(diff)}
            >
              <div className={styles.optionContent}>
                <span className={styles.optionLabel}>
                  {diff === 'easy' && '简单'}
                  {diff === 'medium' && '中等'}
                  {diff === 'hard' && '困难'}
                </span>
                <span className={styles.optionDetail}>
                  {DIFFICULTY_PRESETS[diff].rows}×{DIFFICULTY_PRESETS[diff].cols} · {DIFFICULTY_PRESETS[diff].mineCount} 颗雷
                </span>
              </div>
              {currentDifficulty === diff && <Check size={20} className={styles.checkIcon} />}
            </button>
          ))}
          
          <div className={styles.divider}>
            <Settings size={16} />
            <span>自定义</span>
          </div>
          
          <div className={styles.customSettings}>
            <div className={styles.settingRow}>
              <label>行数</label>
              <input
                type="number"
                min="5"
                max="50"
                value={customConfig.rows}
                onChange={(e) => handleCustomChange('rows', parseInt(e.target.value) || 5)}
              />
            </div>
            <div className={styles.settingRow}>
              <label>列数</label>
              <input
                type="number"
                min="5"
                max="100"
                value={customConfig.cols}
                onChange={(e) => handleCustomChange('cols', parseInt(e.target.value) || 5)}
              />
            </div>
            <div className={styles.settingRow}>
              <label>地雷数</label>
              <input
                type="number"
                min="1"
                max={Math.floor(customConfig.rows * customConfig.cols * 0.8)}
                value={customConfig.mineCount}
                onChange={(e) => handleCustomChange('mineCount', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          
          <button
            className={`${styles.option} ${styles.customButton}`}
            onClick={() => handleSelect('custom')}
          >
            <div className={styles.optionContent}>
              <span className={styles.optionLabel}>开始自定义游戏</span>
              <span className={styles.optionDetail}>
                {customConfig.rows}×{customConfig.cols} · {customConfig.mineCount} 颗雷
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
