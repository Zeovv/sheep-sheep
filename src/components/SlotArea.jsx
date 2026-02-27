import React from 'react';
import { MAX_SLOTS } from '../utils/constants';

/**
 * 槽位区域组件
 * @param {Object} props
 * @param {Array} props.slots - 槽位中的瓦片数组
 * @param {Function} props.onSlotClick - 槽位点击回调（可选）
 * @param {string} props.className - 额外的CSS类
 */
function SlotArea({ slots = [], onSlotClick, className = '' }) {
  // 创建槽位数组（最多MAX_SLOTS个）
  const slotArray = Array.from({ length: MAX_SLOTS }, (_, index) => ({
    id: `slot_${index}`,
    tile: slots[index] || null,
    index
  }));

  // 槽位使用比例
  const usagePercentage = (slots.length / MAX_SLOTS) * 100;

  // 根据使用率确定颜色
  let usageColor = 'bg-green-500';
  if (usagePercentage > 70) {
    usageColor = 'bg-red-500';
  } else if (usagePercentage > 50) {
    usageColor = 'bg-yellow-500';
  }

  const handleSlotClick = (index) => {
    if (onSlotClick && slots[index]) {
      onSlotClick(slots[index].id);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* 槽位使用状态指示器 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            槽位区域
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {slots.length} / {MAX_SLOTS}
          </span>
        </div>
        <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${usageColor} transition-all duration-500 ease-out`}
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
          {slots.length >= MAX_SLOTS ? '槽位已满！尽快消除瓦片！' : '槽位使用情况'}
        </div>
      </div>

      {/* 槽位网格 */}
      <div className="grid grid-cols-7 gap-2 md:gap-4">
        {slotArray.map((slot) => (
          <div
            key={slot.id}
            className={`
              relative aspect-square rounded-xl border-3
              ${slot.tile
                ? 'border-transparent'
                : 'border-dashed border-gray-400 dark:border-gray-600'
              }
              bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900
              flex items-center justify-center
              transition-all duration-300
              ${slot.tile ? 'shadow-md' : 'shadow-sm'}
              ${onSlotClick && slot.tile ? 'cursor-pointer hover:scale-105' : ''}
            `}
            onClick={() => handleSlotClick(slot.index)}
            title={slot.tile ? `槽位 ${slot.index + 1}: ${slot.tile.type}` : `空槽位 ${slot.index + 1}`}
          >
            {slot.tile ? (
              // 有瓦片的槽位
              <div className="relative w-full h-full flex items-center justify-center">
                <div
                  className={`
                    w-4/5 h-4/5 rounded-lg flex items-center justify-center
                    text-3xl shadow-inner
                    ${slot.tile.isSelected ? 'ring-2 ring-yellow-400' : ''}
                  `}
                  style={{
                    background: slot.tile.isSelected
                      ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))'
                  }}
                >
                  {slot.tile.type}
                </div>
                {/* 槽位编号 */}
                <div className="absolute top-1 left-1 text-xs bg-black bg-opacity-50 text-white px-1 rounded">
                  {slot.index + 1}
                </div>
              </div>
            ) : (
              // 空槽位
              <div className="text-gray-400 dark:text-gray-600 text-2xl">
                {slot.index + 1}
              </div>
            )}

            {/* 消除动画指示器 */}
            {slot.tile && slot.tile.eliminating && (
              <div className="absolute inset-0 bg-red-500 bg-opacity-50 rounded-xl animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {/* 消除提示 */}
      {slots.length > 0 && (
        <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
          <div className="flex items-center">
            <div className="mr-3 text-2xl">💡</div>
            <div>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                <strong>消除规则：</strong>当槽位中出现3个相同的瓦片时，它们会自动消除。
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                当前槽位中有 {slots.length} 个瓦片，最多可容纳 {MAX_SLOTS} 个。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SlotArea;