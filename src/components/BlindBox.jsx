import React from 'react';
import Tile from './Tile';
import { BLIND_BOX_WIDTH, BLIND_BOX_HEIGHT } from '../utils/constants';

/**
 * 盲盒组件 - 简洁设计
 */
function BlindBox({ tiles, side, onClick, className = '' }) {
  const handleClick = () => {
    if (tiles.length > 0 && onClick) {
      onClick(side);
    }
  };

  const visibleTile = tiles.length > 0 ? tiles[0] : null;
  const remainingCount = Math.max(0, tiles.length - 1);

  const boxStyle = {
    width: `${BLIND_BOX_WIDTH}px`,
    height: `${BLIND_BOX_HEIGHT}px`,
    background: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
    borderRadius: '8px',
    border: '2px dashed #999',
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="relative flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
        style={boxStyle}
        onClick={handleClick}
      >
        {visibleTile ? (
          <>
            {/* 显示最前面的瓦片 */}
            <div 
              className="flex items-center justify-center w-full h-full"
              style={{ position: 'relative' }}
            >
              <div
                className="flex items-center justify-center rounded-lg shadow-md cursor-pointer hover:scale-110 transition-transform bg-white border-2"
                style={{
                  width: `${visibleTile.width}px`,
                  height: `${visibleTile.height}px`,
                }}
                onClick={() => onClick(side)}
              >
                <span className="text-2xl select-none">{visibleTile.type}</span>
              </div>
            </div>
            
            {/* 堆叠数量提示 */}
            {remainingCount > 0 && (
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                +{remainingCount}
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-400">
            <div className="text-3xl mb-1">📦</div>
            <div className="text-xs">已空</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlindBox;
