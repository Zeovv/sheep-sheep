/**
 * 检查两个矩形是否重叠
 * @param {Object} tileA - 瓦片A
 * @param {Object} tileB - 瓦片B
 * @returns {boolean} 是否重叠
 */
export function isOverlap(tileA, tileB) {
  // 矩形碰撞检测
  return !(
    tileA.x + tileA.width < tileB.x ||
    tileA.x > tileB.x + tileB.width ||
    tileA.y + tileA.height < tileB.y ||
    tileA.y > tileB.y + tileB.height
  );
}

/**
 * 计算瓦片的遮挡状态
 * @param {Array} tiles - 瓦片数组
 * @returns {Array} 更新遮挡状态后的瓦片数组
 */
export function calculateBlockedTiles(tiles) {
  // 按层级从高到低排序
  const sortedTiles = [...tiles].sort((a, b) => b.layer - a.layer);
  const blockedMap = new Map();

  for (let i = 0; i < sortedTiles.length; i++) {
    const currentTile = sortedTiles[i];
    let isBlocked = false;

    // 检查当前瓦片是否被任何上层瓦片遮挡
    for (let j = 0; j < i; j++) {
      const upperTile = sortedTiles[j];
      if (isOverlap(currentTile, upperTile)) {
        isBlocked = true;
        break;
      }
    }

    blockedMap.set(currentTile.id, isBlocked);
  }

  // 更新瓦片状态
  return tiles.map(tile => ({
    ...tile,
    isBlocked: blockedMap.get(tile.id) || false
  }));
}

/**
 * 获取可点击的激活瓦片（未被遮挡的瓦片）
 * @param {Array} tiles - 瓦片数组
 * @returns {Array} 可点击的瓦片数组
 */
export function getActiveTiles(tiles) {
  return tiles.filter(tile => !tile.isBlocked && tile.isVisible);
}