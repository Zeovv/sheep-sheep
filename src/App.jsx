import React from 'react';
import './App.css';
import { useGameState } from './hooks/useGameState';
import GameBoard from './components/GameBoard';
import SlotArea from './components/SlotArea';

function App() {
  const {
    tiles,
    slots,
    score,
    moves,
    gameStatus,
    handleTileClick,
    restartGame
  } = useGameState();

  // 计算剩余瓦片总数
  const totalTilesRemaining = tiles.length;

  return (
    <div className="game-container">
      {/* 简洁的标题栏 */}
      <header className="game-header">
        <h1 className="game-title">
          🐑 羊了个羊
        </h1>
        <div className="game-stats">
          <span>分数: <strong className="stat-score">{score}</strong></span>
          <span>步数: <strong className="stat-moves">{moves}</strong></span>
          <span>剩余: <strong className="stat-remaining">{totalTilesRemaining}</strong></span>
        </div>
      </header>

      {/* 主游戏区域 */}
      <div className="game-main">
        {/* 游戏板 */}
        <div className="game-board-wrapper">
          <GameBoard
            tiles={tiles}
            onTileClick={handleTileClick}
          />
        </div>

        {/* 槽位区域 */}
        <div className="slot-area-wrapper">
          <SlotArea slots={slots} />
        </div>
      </div>

      {/* 游戏状态遮罩 */}
      {gameStatus !== 'playing' && (
        <div className="game-overlay">
          <div className="game-modal">
            <div className="modal-emoji">
              {gameStatus === 'won' ? '🎉' : '😢'}
            </div>
            <h2 className="modal-title">
              {gameStatus === 'won' ? '恭喜通关！' : '游戏结束'}
            </h2>
            <p className="modal-message">
              {gameStatus === 'won'
                ? '你成功清除了所有瓦片！'
                : '槽位已满，无法继续消除。'}
            </p>
            <div className="modal-stats">
              <div className="modal-stat">
                <div className="modal-stat-value">{score}</div>
                <div className="modal-stat-label">分数</div>
              </div>
              <div className="modal-stat">
                <div className="modal-stat-value">{moves}</div>
                <div className="modal-stat-label">步数</div>
              </div>
            </div>
            <button
              onClick={restartGame}
              className="modal-button"
            >
              再来一局
            </button>
          </div>
        </div>
      )}

      {/* 重新开始按钮（游戏中显示） */}
      {gameStatus === 'playing' && (
        <button
          onClick={restartGame}
          className="restart-button"
        >
          重新开始
        </button>
      )}
    </div>
  );
}

export default App;
