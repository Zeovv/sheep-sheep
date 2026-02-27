import { useCallback } from 'react';
import { calculateBlockedTiles } from '../utils/collisionDetection';

/**
 * 碰撞检测Hook
 */
export function useCollisionDetection() {
  /**
   * 更新瓦片的遮挡状态
   * @param {Array} tiles - 瓦片数组
   * @returns {Array} 更新后的瓦片数组
   */
  const updateBlockedTiles = useCallback((tiles) => {
    return calculateBlockedTiles(tiles);
  }, []);

  /**
   * 检查单个瓦片是否被遮挡
   * @param {Object} tile - 要检查的瓦片
   * @param {Array} allTiles - 所有瓦片数组
   * @returns {boolean} 是否被遮挡
   */
  const isTileBlocked = useCallback((tile, allTiles) => {
    // 按层级排序
    const higherTiles = allTiles.filter(t => t.layer > tile.layer);

    // 检查是否有上层瓦片重叠
    for (const higherTile of higherTiles) {
      // 简单矩形碰撞检测
      const overlap = !(
        tile.x + tile.width < higherTile.x ||
        tile.x > higherTile.x + higherTile.width ||
        tile.y + tile.height < higherTile.y ||
        tile.y > higherTile.y + higherTile.height
      );

      if (overlap) {
        return true;
      }
    }

    return false;
  }, []);

  return {
    updateBlockedTiles,
    isTileBlocked
  };
}