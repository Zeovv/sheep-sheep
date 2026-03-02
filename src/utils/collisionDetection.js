/**
 * 检查两个矩形是否重叠（使用像素坐标）
 * 重叠阈值为0，只要有重叠就不能被点击
 * @param {Object} tileA - 瓦片A
 * @param {Object} tileB - 瓦片B
 * @returns {boolean} 是否重叠
 */
export function isOverlap(tileA, tileB) {
  // 使用标准的矩形碰撞检测
  // 如果两个矩形不重叠，则返回false
  // 如果重叠，返回true
  
  // 检查是否有任何重叠
  const noOverlap = 
    tileA.x + tileA.width <= tileB.x ||  // A在B的左边
    tileB.x + tileB.width <= tileA.x ||   // B在A的左边
    tileA.y + tileA.height <= tileB.y ||  // A在B的上边
    tileB.y + tileB.height <= tileA.y;    // B在A的上边
  
  // 如果不重叠，返回false；如果重叠，返回true
  return !noOverlap;
}

/**
 * 计算瓦片的遮挡状态
 * @param {Array} tiles - 瓦片数组
 * @returns {Array} 更新遮挡状态后的瓦片数组
 */
export function calculateBlockedTiles(tiles) {
  if (!tiles || tiles.length === 0) return [];
  
  const sortedTiles = [...tiles].sort((a, b) => {
    if (b.layer !== a.layer) {
      return b.layer - a.layer;
    }
    if (Math.abs(a.y - b.y) > 1) {
      return a.y - b.y;
    }
    return a.x - b.x;
  });
  
  const blockedMap = new Map();
  
  tiles.forEach(tile => {
    blockedMap.set(tile.id, false);
  });
  
  for (let i = 0; i < sortedTiles.length; i++) {
    const currentTile = sortedTiles[i];
    
    if (blockedMap.get(currentTile.id)) continue;
    
    for (let j = 0; j < i; j++) {
      const upperTile = sortedTiles[j];
      
      if (upperTile.layer < currentTile.layer) continue;
      if (isOverlap(upperTile, currentTile)) {
        blockedMap.set(currentTile.id, true);
        break;
      }
    }
  }
  
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
