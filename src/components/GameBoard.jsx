import React from 'react';
import Tile from './Tile';
import { GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT } from '../utils/constants';

/**
 * 游戏板组件
 * @param {Object} props
 * @param {Array} props.tiles - 瓦片数组
 * @param {Function} props.onTileClick - 瓦片点击回调
 * @param {string} props.className - 额外的CSS类
 */
function GameBoard({ tiles = [], onTileClick, className = '' }) {
  // 计算激活的瓦片（未被遮挡的）
  const activeTiles = tiles.filter(tile => !tile.isBlocked);

  // 按层级分组，用于调试显示
  const tilesByLayer = {};
  tiles.forEach(tile => {
    if (!tilesByLayer[tile.layer]) {
      tilesByLayer[tile.layer] = [];
    }
    tilesByLayer[tile.layer].push(tile);
  });

  // 游戏板样式
  const boardStyle = {
    width: `${GAME_BOARD_WIDTH}px`,
    height: `${GAME_BOARD_HEIGHT}px`,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      {/* 游戏板标题和状态 */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-r from-black/30 to-transparent">
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">主游戏区</h2>
        <div className="flex items-center space-x-4 mt-2">
          <span className="text-sm text-white/90">
            总瓦片: <strong>{tiles.length}</strong>
          </span>
          <span className="text-sm text-white/90">
            可点击: <strong>{activeTiles.length}</strong>
          </span>
          <span className="text-sm text-white/90">
            层级: <strong>{Object.keys(tilesByLayer).length}</strong>
          </span>
        </div>
      </div>

      {/* 游戏板主体 */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={boardStyle}
      >
        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* 渲染所有瓦片 */}
        {tiles.map(tile => (
          <Tile
            key={tile.id}
            tile={tile}
            isActive={!tile.isBlocked}
            isSelected={tile.isSelected}
            onClick={onTileClick}
          />
        ))}

        {/* 游戏板说明 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="text-sm text-white/90">
            <p className="font-semibold">📌 游戏说明：</p>
            <p>点击未被遮挡的瓦片（高亮显示）将其移动到下方槽位。</p>
            <p>被遮挡的瓦片会变暗，需要先移除上方的瓦片。</p>
          </div>
        </div>

        {/* 调试信息（开发环境显示） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-16 right-4 bg-black/70 text-white text-xs p-2 rounded-lg">
            <div className="font-bold mb-1">调试信息</div>
            <div>总瓦片: {tiles.length}</div>
            <div>激活瓦片: {activeTiles.length}</div>
            <div>层级分布:</div>
            {Object.entries(tilesByLayer).map(([layer, layerTiles]) => (
              <div key={layer}>层级 {layer}: {layerTiles.length} 个瓦片</div>
            ))}
          </div>
        )}
      </div>

      {/* 游戏提示 */}
      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg">
        <div className="flex items-start">
          <div className="mr-3 text-2xl">🎮</div>
          <div>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              <strong>游戏策略：</strong>优先移除上层的瓦片，解锁下层的瓦片。
              合理利用盲盒中的瓦片，但注意不要填满槽位。
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              提示：观察瓦片的堆叠关系，规划消除顺序。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameBoard;