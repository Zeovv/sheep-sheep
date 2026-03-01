import { TILE_TYPES, TOTAL_TILES, TILE_WIDTH, TILE_HEIGHT } from './constants';

/**
 * 生成瓦片数组
 * @param {number} totalTiles - 瓦片总数（必须是3的倍数）
 * @returns {Array} 瓦片数组
 */
export function generateTiles(totalTiles = TOTAL_TILES) {
  // 确保总数是3的倍数
  const count = Math.ceil(totalTiles / 3) * 3;
  const tiles = [];

  // 每种类型至少生成3个，确保可消除
  const tilesPerType = Math.ceil(count / TILE_TYPES.length);

  let idCounter = 0;
  TILE_TYPES.forEach(type => {
    for (let i = 0; i < tilesPerType; i++) {
      if (tiles.length < count) {
        // 更合理的层级分布：大部分在0-3层，少量在4-5层
        const layer = Math.random() < 0.7 
          ? Math.floor(Math.random() * 4) // 0-3层（70%概率）
          : Math.floor(Math.random() * 2) + 4; // 4-5层（30%概率）
        
        tiles.push({
          id: `tile_${idCounter++}`,
          type,
          layer,
          x: Math.random() * 80 + 10, // 10-90%位置
          y: Math.random() * 60 + 10, // 10-70%位置
          width: TILE_WIDTH,
          height: TILE_HEIGHT,
          isBlocked: false,
          isSelected: false,
          isVisible: true // 用于盲盒
        });
      }
    }
  });

  // Fisher-Yates洗牌算法
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  return tiles;
}

/**
 * 初始化盲盒
 * @param {Array} tiles - 所有瓦片
 * @param {number} boxesPerSide - 每侧盲盒数量
 * @param {number} tilesPerBox - 每个盲盒瓦片数
 * @returns {Object} 包含左右盲盒和剩余瓦片的对象
 */
export function initializeBlindBoxes(tiles, boxesPerSide = 1, tilesPerBox = 8) {
  // 创建左右盲盒
  let leftBox = [];
  let rightBox = [];

  // 从总瓦片中分配一部分到盲盒
  const shuffledTiles = [...tiles];

  // Fisher-Yates洗牌
  for (let i = shuffledTiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledTiles[i], shuffledTiles[j]] = [shuffledTiles[j], shuffledTiles[i]];
  }

  // 分配瓦片到盲盒
  for (let i = 0; i < tilesPerBox; i++) {
    if (i < shuffledTiles.length) {
      leftBox.push({ ...shuffledTiles[i], isVisible: false });
    }
    if (i + tilesPerBox < shuffledTiles.length) {
      rightBox.push({ ...shuffledTiles[i + tilesPerBox], isVisible: false });
    }
  }

  // 设置最前面的瓦片为可见
  if (leftBox.length > 0) {
    leftBox = [{ ...leftBox[0], isVisible: true }, ...leftBox.slice(1)];
  }
  if (rightBox.length > 0) {
    rightBox = [{ ...rightBox[0], isVisible: true }, ...rightBox.slice(1)];
  }

  // 剩余的瓦片放在主绘图区
  const remainingTiles = shuffledTiles.slice(tilesPerBox * 2);

  return {
    leftBox,
    rightBox,
    remainingTiles
  };
}

/**
 * 从盲盒中取出瓦片
 * @param {Array} box - 盲盒数组
 * @param {string} boxSide - 盲盒侧边（'left' 或 'right'）
 * @returns {Object|null} 取出的瓦片或null
 */
export function takeFromBlindBox(box, boxSide) {
  if (box.length === 0) return null;

  // 取出最前面的瓦片（不可变版本）
  const takenTile = box[0];
  const newBox = box.slice(1).map((tile, index) =>
    index === 0 ? { ...tile, isVisible: true } : tile
  );

  // 返回取出的瓦片和新盲盒数组
  // 注意：调用者需要更新状态
  return { takenTile, newBox };
}