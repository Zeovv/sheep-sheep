import { useCallback } from 'react';
import { calculateBlockedTiles } from '../utils/collisionDetection';

/**
 * 碰撞检测Hook（保留用于未来扩展）
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

  return {
    updateBlockedTiles
  };
}
