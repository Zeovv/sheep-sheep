/**
 * 检查槽位中是否有可消除的瓦片
 * @param {Array} slots - 槽位中的瓦片数组
 * @returns {Object} 消除信息
 */
export function checkElimination(slots) {
  const typeCounts = {};
  const tilesByType = {};

  // 统计每种类型的数量
  slots.forEach(tile => {
    typeCounts[tile.type] = (typeCounts[tile.type] || 0) + 1;
    if (!tilesByType[tile.type]) {
      tilesByType[tile.type] = [];
    }
    tilesByType[tile.type].push(tile);
  });

  // 找出数量达到3的类型
  const typesToEliminate = Object.keys(typeCounts).filter(
    type => typeCounts[type] >= 3
  );

  // 收集要消除的瓦片（每种类型取前3个）
  const tilesToRemove = [];
  typesToEliminate.forEach(type => {
    tilesToRemove.push(...tilesByType[type].slice(0, 3));
  });

  return {
    canEliminate: typesToEliminate.length > 0,
    typesToEliminate,
    tilesToRemove
  };
}

/**
 * 从槽位中移除指定瓦片
 * @param {Array} slots - 当前槽位数组
 * @param {Array} tilesToRemove - 要移除的瓦片数组
 * @returns {Array} 移除后的槽位数组
 */
export function removeTilesFromSlots(slots, tilesToRemove) {
  const removeIds = new Set(tilesToRemove.map(tile => tile.id));
  return slots.filter(tile => !removeIds.has(tile.id));
}

/**
 * 检查游戏胜利条件
 * @param {Array} tiles - 主游戏区瓦片
 * @param {Array} leftBox - 左侧盲盒
 * @param {Array} rightBox - 右侧盲盒
 * @param {Array} slots - 槽位瓦片
 * @returns {boolean} 是否胜利
 */
export function checkWinCondition(tiles, leftBox, rightBox, slots) {
  return tiles.length === 0 &&
         leftBox.length === 0 &&
         rightBox.length === 0 &&
         slots.length === 0;
}

/**
 * 检查游戏失败条件
 * @param {Array} slots - 槽位瓦片
 * @param {number} maxSlots - 最大槽位数
 * @returns {boolean} 是否失败
 */
export function checkLoseCondition(slots, maxSlots) {
  return slots.length >= maxSlots;
}