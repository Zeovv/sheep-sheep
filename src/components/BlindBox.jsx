import React from 'react';
import Tile from './Tile';

/**
 * 盲盒组件
 * @param {Object} props
 * @param {Array} props.tiles - 盲盒中的瓦片数组
 * @param {string} props.side - 盲盒侧边（'left' 或 'right'）
 * @param {Function} props.onClick - 点击回调
 * @param {string} props.className - 额外的CSS类
 */
function BlindBox({ tiles, side, onClick, className = '' }) {
  const handleClick = () => {
    if (tiles.length > 0 && onClick) {
      onClick(side);
    }
  };

  // 盲盒标题
  const sideLabels = {
    left: '左侧盲盒',
    right: '右侧盲盒'
  };

  // 盲盒样式
  const boxStyle = {
    width: '120px',
    height: '400px',
  };

  // 计算堆叠偏移
  const getStackOffset = (index) => {
    // 每层偏移量
    return index * 4;
  };

  // 可见瓦片（最前面的）
  const visibleTile = tiles.length > 0 ? tiles[0] : null;
  // 剩余瓦片数量
  const remainingCount = Math.max(0, tiles.length - 1);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* 盲盒标题 */}
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {sideLabels[side]}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          剩余瓦片: {tiles.length}
        </p>
      </div>

      {/* 盲盒容器 */}
      <div
        className="relative border-4 border-dashed border-gray-400 rounded-xl bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center"
        style={boxStyle}
        onClick={handleClick}
      >
        {visibleTile ? (
          // 显示最前面的瓦片
          <div className="relative">
            {/* 堆叠效果 */}
            {remainingCount > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl text-gray-300 dark:text-gray-700 opacity-50">
                  {remainingCount}
                </div>
              </div>
            )}

            {/* 可见瓦片 */}
            <Tile
              tile={visibleTile}
              isActive={true}
              isSelected={false}
              onClick={() => onClick(side)}
              className="relative z-10"
            />

            {/* 堆叠指示器 */}
            {remainingCount > 0 && (
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                +{remainingCount} 个瓦片
              </div>
            )}
          </div>
        ) : (
          // 空盲盒状态
          <div className="text-center p-4">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 dark:text-gray-400">盲盒已空</p>
          </div>
        )}

        {/* 点击提示 */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 dark:text-gray-400">
          {tiles.length > 0 ? '点击取走最前面的瓦片' : '盲盒已空'}
        </div>
      </div>

      {/* 盲盒说明 */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 max-w-xs text-center">
        <p>盲盒中包含多个堆叠的瓦片，只有最前面的瓦片可见可点击。</p>
        <p>点击盲盒可以取走最前面的瓦片，后面的瓦片会自动补上。</p>
      </div>
    </div>
  );
}

export default BlindBox;