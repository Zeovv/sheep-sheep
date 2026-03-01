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
  
  // 按层级从高到低排序（layer大的在上层）
  const sortedTiles = [...tiles].sort((a, b) => {
    if (b.layer !== a.layer) {
      return b.layer - a.layer; // 层级高的在前
    }
    // 同层级时，按y坐标排序（上方的在前）
    if (Math.abs(a.y - b.y) > 1) {
      return a.y - b.y;
    }
    // y坐标相近时，按x坐标排序
    return a.x - b.x;
  });
  
  const blockedMap = new Map();
  
  // 初始化所有瓦片为未遮挡
  tiles.forEach(tile => {
    blockedMap.set(tile.id, false);
  });
  
  // 从上层到下层检查遮挡关系
  for (let i = 0; i < sortedTiles.length; i++) {
    const currentTile = sortedTiles[i];
    
    // 如果当前瓦片已经被标记为遮挡，跳过
    if (blockedMap.get(currentTile.id)) continue;
    
    // 检查当前瓦片是否被任何上层瓦片遮挡
    // j < i 意味着 upperTile 在 sortedTiles 中排在 currentTile 前面
    // 由于我们按layer从高到低排序，所以j < i意味着upperTile.layer >= currentTile.layer
    for (let j = 0; j < i; j++) {
      const upperTile = sortedTiles[j];
      
      // 只有上层瓦片（layer更大）才能遮挡下层瓦片
      if (upperTile.layer > currentTile.layer) {
        if (isOverlap(upperTile, currentTile)) {
          blockedMap.set(currentTile.id, true);
          break; // 一旦被遮挡，就不需要继续检查
        }
      }
    }
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
