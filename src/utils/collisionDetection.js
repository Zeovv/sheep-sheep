/**
 * 检查两个矩形是否重叠
 * @param {Object} tileA - 瓦片A
 * @param {Object} tileB - 瓦片B
 * @param {number} boardWidth - 游戏板宽度（像素）
 * @param {number} boardHeight - 游戏板高度（像素）
 * @returns {boolean} 是否重叠
 */
export function isOverlap(tileA, tileB, boardWidth = 800, boardHeight = 600) {
  // 将百分比坐标转换为像素坐标
  const ax = (tileA.x / 100) * boardWidth;
  const ay = (tileA.y / 100) * boardHeight;
  const aw = tileA.width;
  const ah = tileA.height;
  
  const bx = (tileB.x / 100) * boardWidth;
  const by = (tileB.y / 100) * boardHeight;
  const bw = tileB.width;
  const bh = tileB.height;
  
  // 矩形碰撞检测
  return !(
    ax + aw < bx ||
    ax > bx + bw ||
    ay + ah < by ||
    ay > by + bh
  );
}

/**
 * 计算瓦片的遮挡状态
 * @param {Array} tiles - 瓦片数组
 * @param {number} boardWidth - 游戏板宽度（像素）
 * @param {number} boardHeight - 游戏板高度（像素）
 * @returns {Array} 更新遮挡状态后的瓦片数组
 */
export function calculateBlockedTiles(tiles, boardWidth = 800, boardHeight = 600) {
  // 按层级从高到低排序
  const sortedTiles = [...tiles].sort((a, b) => b.layer - a.layer);
  const blockedMap = new Map();

  for (let i = 0; i < sortedTiles.length; i++) {
    const currentTile = sortedTiles[i];
    let isBlocked = false;

    // 检查当前瓦片是否被任何上层瓦片遮挡
    for (let j = 0; j < i; j++) {
      const upperTile = sortedTiles[j];
      if (isOverlap(currentTile, upperTile, boardWidth, boardHeight)) {
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