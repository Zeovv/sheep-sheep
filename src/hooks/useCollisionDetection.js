import { useCallback } from 'react';
import { calculateBlockedTiles } from '../utils/collisionDetection';
import { GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT } from '../utils/constants';

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
    return calculateBlockedTiles(tiles, GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
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
      // 将百分比坐标转换为像素坐标
      const tx = (tile.x / 100) * GAME_BOARD_WIDTH;
      const ty = (tile.y / 100) * GAME_BOARD_HEIGHT;
      const tw = tile.width;
      const th = tile.height;
      
      const hx = (higherTile.x / 100) * GAME_BOARD_WIDTH;
      const hy = (higherTile.y / 100) * GAME_BOARD_HEIGHT;
      const hw = higherTile.width;
      const hh = higherTile.height;
      
      // 矩形碰撞检测
      const overlap = !(
        tx + tw < hx ||
        tx > hx + hw ||
        ty + th < hy ||
        ty > hy + hh
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