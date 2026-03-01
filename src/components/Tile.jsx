import React from 'react';

/**
 * 瓦片组件 - 简洁设计，类似原版
 * 交互规则：
 * - 仅当 actuallyActive（未被遮挡且标记为可点击）时才响应点击
 * - 被遮挡的牌 pointer-events: none，物理上不可点击
 */
function Tile({ tile, onClick, isActive, className = '' }) {
  // 统一定义：actuallyActive = 逻辑上“可点击”
  const actuallyActive = isActive && !tile.isBlocked;

  const handleClick = () => {
    if (actuallyActive && onClick) {
      onClick(tile.id);
    }
  };

  // 计算样式（基于像素坐标）
  const tileStyle = {
    position: 'absolute',
    left: `${tile.x}px`,
    top: `${tile.y}px`,
    width: `${tile.width}px`,
    height: `${tile.height}px`,
    zIndex: tile.layer + 10, // 确保层级正确
    pointerEvents: actuallyActive ? 'auto' : 'none', // 被遮挡的牌完全不可点击
  };

  // 基础样式类
  let baseClasses = 'flex items-center justify-center rounded-lg shadow-md transition-all duration-200 ';
  
  if (actuallyActive) {
    baseClasses += 'cursor-pointer hover:scale-110 hover:shadow-lg active:scale-95 ';
  } else {
    baseClasses += 'cursor-not-allowed opacity-50 ';
  }

  // 简洁的背景色设计
  const typeColors = {
    '🐑': 'bg-white border-2 border-blue-300',
    '🌽': 'bg-white border-2 border-yellow-300',
    '🥕': 'bg-white border-2 border-orange-300',
    '🔔': 'bg-white border-2 border-green-300',
    '🍎': 'bg-white border-2 border-red-300',
    '🍌': 'bg-white border-2 border-yellow-200',
    '🍇': 'bg-white border-2 border-purple-300',
    '🍒': 'bg-white border-2 border-pink-300',
  };

  const colorClass = typeColors[tile.type] || 'bg-white border-2 border-gray-300';

  return (
    <div
      className={`${baseClasses} ${colorClass} ${className}`}
      style={tileStyle}
      onClick={handleClick}
    >
      <span className="text-2xl select-none pointer-events-none">{tile.type}</span>
    </div>
  );
}

export default Tile;
