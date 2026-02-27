import React from 'react';

/**
 * 瓦片组件
 * @param {Object} props
 * @param {Object} props.tile - 瓦片数据
 * @param {Function} props.onClick - 点击回调
 * @param {boolean} props.isActive - 是否可点击（未被遮挡）
 * @param {boolean} props.isSelected - 是否被选中
 * @param {string} props.className - 额外的CSS类
 */
function Tile({ tile, onClick, isActive, isSelected, className = '' }) {
  const handleClick = () => {
    if (isActive && onClick) {
      onClick(tile.id);
    }
  };

  // 计算样式
  const tileStyle = {
    left: `${tile.x}%`,
    top: `${tile.y}%`,
    width: `${tile.width}px`,
    height: `${tile.height}px`,
    zIndex: tile.layer,
  };

  // 基础样式类
  let baseClasses = 'absolute flex items-center justify-center rounded-lg shadow-lg transition-all duration-300 cursor-pointer transform ';

  if (isActive) {
    baseClasses += 'hover:scale-105 hover:shadow-xl active:scale-95 ';
  } else {
    baseClasses += 'cursor-not-allowed ';
  }

  if (isSelected) {
    baseClasses += 'ring-4 ring-yellow-400 ring-opacity-70 ';
  }

  // 状态样式
  if (!isActive) {
    baseClasses += 'filter brightness-50 grayscale-30 ';
  }

  // 根据类型添加背景色
  const typeColors = {
    '🐑': 'bg-gradient-to-br from-blue-100 to-blue-300 border-2 border-blue-400',
    '🌽': 'bg-gradient-to-br from-yellow-100 to-yellow-300 border-2 border-yellow-400',
    '🥕': 'bg-gradient-to-br from-orange-100 to-orange-300 border-2 border-orange-400',
    '🔔': 'bg-gradient-to-br from-green-100 to-green-300 border-2 border-green-400',
    '🍎': 'bg-gradient-to-br from-red-100 to-red-300 border-2 border-red-400',
    '🍌': 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300',
    '🍇': 'bg-gradient-to-br from-purple-100 to-purple-300 border-2 border-purple-400',
    '🍒': 'bg-gradient-to-br from-pink-100 to-pink-300 border-2 border-pink-400',
  };

  const colorClass = typeColors[tile.type] || 'bg-gradient-to-br from-gray-100 to-gray-300 border-2 border-gray-400';

  return (
    <div
      className={`${baseClasses} ${colorClass} ${className}`}
      style={tileStyle}
      onClick={handleClick}
      title={isActive ? `点击选择 ${tile.type}` : '被遮挡，无法选择'}
    >
      <span className="text-3xl select-none">{tile.type}</span>
      {/* 显示层级（调试用） */}
      {process.env.NODE_ENV === 'development' && (
        <span className="absolute top-0 right-0 text-xs bg-black bg-opacity-50 text-white px-1 rounded">
          {tile.layer}
        </span>
      )}
    </div>
  );
}

export default Tile;