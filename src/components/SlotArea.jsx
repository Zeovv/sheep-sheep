import React from 'react';
import { MAX_SLOTS } from '../utils/constants';

/**
 * 槽位区域组件 - 简洁设计
 */
function SlotArea({ slots = [], className = '' }) {
  const slotArray = Array.from({ length: MAX_SLOTS }, (_, index) => ({
    id: `slot_${index}`,
    tile: slots[index] || null,
    index
  }));

  const usagePercentage = (slots.length / MAX_SLOTS) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* 槽位网格 */}
      <div className="flex justify-center gap-2">
        {slotArray.map((slot) => (
          <div
            key={slot.id}
            className={`
              relative w-12 h-12 rounded-lg border-2
              ${slot.tile
                ? 'border-gray-300 bg-white shadow-sm'
                : 'border-dashed border-gray-300 bg-gray-50'
              }
              flex items-center justify-center
              transition-all duration-200
            `}
          >
            {slot.tile ? (
              <span className="text-2xl select-none">{slot.tile.type}</span>
            ) : (
              <div className="w-8 h-8 border border-gray-200 rounded"></div>
            )}
            
            {/* 警告提示 */}
            {slot.index === MAX_SLOTS - 1 && slots.length >= MAX_SLOTS && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-red-500 text-xs font-bold whitespace-nowrap">
                槽位已满！
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* 使用率指示器 */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-xs">
          <div
            className={`h-full transition-all duration-300 ${
              usagePercentage >= 100
                ? 'bg-red-500'
                : usagePercentage >= 70
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(100, usagePercentage)}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 min-w-[3rem] text-right">
          {slots.length}/{MAX_SLOTS}
        </span>
      </div>
    </div>
  );
}

export default SlotArea;
