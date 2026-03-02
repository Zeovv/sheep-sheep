import React from 'react';
import Tile from './Tile';
import { GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT } from '../utils/constants';

/**
 * 游戏板组件 - 简洁设计
 */
function GameBoard({ tiles = [], onTileClick, className = '' }) {
  const boardStyle = {
    width: `${GAME_BOARD_WIDTH}px`,
    height: `${GAME_BOARD_HEIGHT}px`,
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className={`relative mx-auto ${className}`}>
      <div
        className="relative overflow-hidden"
        style={boardStyle}
      >
        {/* 渲染所有瓦片 */}
        {tiles.map(tile => (
          <Tile
            key={tile.id}
            tile={tile}
            isActive={!tile.isBlocked}
            onClick={onTileClick}
          />
        ))}
        
        {/* 空状态提示 */}
        {tiles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">✨</div>
              <div className="text-sm">所有瓦片已清除</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameBoard;
