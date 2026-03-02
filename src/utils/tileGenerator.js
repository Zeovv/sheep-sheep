import { 
  TILE_TYPES, 
  GRID_SIZE, 
  GAME_BOARD_WIDTH, 
  GAME_BOARD_HEIGHT,
  TILE_WIDTH,
  TILE_HEIGHT,
  BOARD_PADDING,
  GRID_UNIT,
  TOTAL_TILES,
  MIN_LAYERS,
  MAX_LAYERS
} from './constants';

/**
 * 将网格坐标转换为像素坐标
 * @param {number} gridX - 网格X坐标 (0-6)
 * @param {number} gridY - 网格Y坐标 (0-6)
 * @returns {Object} {x, y} 像素坐标
 */
function gridToPixel(gridX, gridY) {
  const cellWidth = (GAME_BOARD_WIDTH - BOARD_PADDING * 2) / GRID_SIZE;
  const cellHeight = (GAME_BOARD_HEIGHT - BOARD_PADDING * 2) / GRID_SIZE;
  
  const x = BOARD_PADDING + gridX * cellWidth;
  const y = BOARD_PADDING + gridY * cellHeight;
  
  // 确保坐标不会让瓦片出界
  const maxX = GAME_BOARD_WIDTH - BOARD_PADDING - TILE_WIDTH;
  const maxY = GAME_BOARD_HEIGHT - BOARD_PADDING - TILE_HEIGHT;
  
  return {
    x: Math.max(BOARD_PADDING, Math.min(x, maxX)),
    y: Math.max(BOARD_PADDING, Math.min(y, maxY))
  };
}

/**
 * 生成对称的网格位置
 * 确保左右对称分布，并且均匀分布在整个游戏板上
 * @param {number} totalPositions - 总位置数
 * @param {number} layers - 层数
 * @returns {Array} 每层的位置数组
 */
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateSymmetricPositions(totalPositions, layers) {
  const basePositions = [];
  const positionsPerLayer = Math.ceil(totalPositions / layers);
  const centerX = (GRID_SIZE - 1) / 2;

  const leftCandidates = [];
  const centerCandidates = [];

  for (let x = 0; x < centerX; x += 1) {
    for (let y = 0; y <= GRID_SIZE - 1; y += GRID_UNIT) {
      leftCandidates.push({ gridX: x, gridY: y });
    }
  }

  for (let y = 0; y <= GRID_SIZE - 1; y += GRID_UNIT) {
    centerCandidates.push({ gridX: centerX, gridY: y });
  }

  for (let layer = 0; layer < layers; layer++) {
    const positions = [];
    const shuffledLeft = shuffleArray(leftCandidates);
    const shuffledCenter = shuffleArray(centerCandidates);
    const pairCount = Math.min(Math.floor(positionsPerLayer / 2), shuffledLeft.length);

    for (let i = 0; i < pairCount; i++) {
      const pos = shuffledLeft[i];
      positions.push(pos);
      positions.push({ gridX: centerX * 2 - pos.gridX, gridY: pos.gridY });
    }

    if (positions.length < positionsPerLayer) {
      const remaining = positionsPerLayer - positions.length;
      for (let i = 0; i < remaining && i < shuffledCenter.length; i++) {
        positions.push(shuffledCenter[i]);
      }
    }

    basePositions.push(positions.slice(0, positionsPerLayer));
  }

  return basePositions;
}

/**
 * 生成随机分配但保证每种牌都是3的倍数的数量
 * @param {number} totalTiles - 总瓦片数
 * @param {number} typeCount - 牌种类数
 * @returns {Array} 每种牌的数量数组
 */
function generateTileCounts(totalTiles, typeCount) {
  const counts = new Array(typeCount).fill(0);
  const minPerType = 3; // 每种至少3个
  const baseTotal = minPerType * typeCount; // 基础总数
  
  // 先给每种牌分配最少3个
  for (let i = 0; i < typeCount; i++) {
    counts[i] = minPerType;
  }
  
  // 剩余的数量随机分配，但每次分配必须是3的倍数
  let remaining = totalTiles - baseTotal;
  
  while (remaining > 0) {
    const randomIndex = Math.floor(Math.random() * typeCount);
    const addAmount = Math.min(3, Math.floor(remaining / 3) * 3); // 每次至少加3个
    
    if (addAmount >= 3) {
      counts[randomIndex] += addAmount;
      remaining -= addAmount;
    } else {
      break;
    }
  }
  
  // 确保总和正确，调整最后一个
  const currentTotal = counts.reduce((sum, count) => sum + count, 0);
  const diff = totalTiles - currentTotal;
  if (diff !== 0 && diff % 3 === 0) {
    counts[counts.length - 1] += diff;
  }
  
  // 验证每种牌都是3的倍数
  return counts.map(count => {
    const remainder = count % 3;
    if (remainder !== 0) {
      return count - remainder; // 向下取整到3的倍数
    }
    return count;
  });
}

/**
 * 生成整齐堆叠的瓦片
 * 上层瓦片可以部分或全部遮挡下层瓦片
 * @param {number} totalTiles - 总瓦片数（必须是3的倍数）
 * @param {number} layers - 层数
 * @returns {Array} 瓦片数组
 */
export function generateTiles(totalTiles = TOTAL_TILES, layers = null) {
  // 如果没有指定层数，使用更多层数增加难度
  if (!layers) {
    layers = Math.floor(Math.random() * (MAX_LAYERS - MIN_LAYERS + 1)) + MIN_LAYERS;
  }
  
  // 确保总数是3的倍数
  totalTiles = Math.ceil(totalTiles / 3) * 3;
  
  // 生成每种牌的数量（保证每种都是3的倍数）
  const tileCounts = generateTileCounts(totalTiles, TILE_TYPES.length);
  
  // 定义堆叠模式：上层瓦片相对于下层瓦片的偏移
  // 支持：上/下/左/右半部分/全部遮挡/左上/右上/左下/右下四分之一
  const stackPatterns = [
    { offsetX: 0, offsetY: 0 },           // 全部遮挡（完全重叠）
    { offsetX: 0.5, offsetY: 0 },        // 右移50%（遮挡左半部分）
    { offsetX: -0.5, offsetY: 0 },        // 左移50%（遮挡右半部分）
    { offsetX: 0, offsetY: 0.5 },         // 下移50%（遮挡上半部分）
    { offsetX: 0, offsetY: -0.5 },        // 上移50%（遮挡下半部分）
    { offsetX: 0.5, offsetY: 0.5 },       // 右下移（遮挡左上四分之一）
    { offsetX: -0.5, offsetY: 0.5 },      // 左下移（遮挡右上四分之一）
    { offsetX: 0.5, offsetY: -0.5 },      // 右上移（遮挡左下四分之一）
    { offsetX: -0.5, offsetY: -0.5 },     // 左上移（遮挡右下四分之一）
  ];
  
  // 生成对称的基础位置
  const basePositions = generateSymmetricPositions(totalTiles, layers);
  
  const tiles = [];
  let idCounter = 0;
  
  // 为每种类型生成瓦片
  TILE_TYPES.forEach((type, typeIndex) => {
    const countForType = tileCounts[typeIndex];
    
    for (let i = 0; i < countForType; i++) {
      // 随机选择层数
      const layer = Math.floor(Math.random() * layers);
      
      // 从该层的基础位置中选择
      const layerPos = basePositions[layer];
      if (!layerPos || layerPos.length === 0) continue;
      
      // 均匀分布：使用循环索引确保均匀分布
      const posIndex = (i * TILE_TYPES.length + typeIndex + idCounter) % layerPos.length;
      let basePos = layerPos[posIndex];
      
      if (layer > 0) {
        const lowerLayer = layer - 1;
        const lowerPositions = basePositions[lowerLayer];
        
        if (lowerPositions && lowerPositions.length > 0) {
          const lowerIndex = Math.min(posIndex, lowerPositions.length - 1);
          const lowerPos = lowerPositions[lowerIndex];
          
          const pattern = stackPatterns[Math.floor(Math.random() * stackPatterns.length)];
          
          const cellWidth = (GAME_BOARD_WIDTH - BOARD_PADDING * 2) / GRID_SIZE;
          const cellHeight = (GAME_BOARD_HEIGHT - BOARD_PADDING * 2) / GRID_SIZE;
          
          basePos = {
            gridX: Math.max(0, Math.min(GRID_SIZE - 1, lowerPos.gridX + pattern.offsetX * (TILE_WIDTH / cellWidth))),
            gridY: Math.max(0, Math.min(GRID_SIZE - 1, lowerPos.gridY + pattern.offsetY * (TILE_HEIGHT / cellHeight)))
          };
        }
      }
      
      // 转换为像素坐标
      const pixelPos = gridToPixel(basePos.gridX, basePos.gridY);
      
      tiles.push({
        id: `tile_${idCounter++}`,
        type,
        layer,
        gridX: basePos.gridX,
        gridY: basePos.gridY,
        x: pixelPos.x,
        y: pixelPos.y,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        isBlocked: false,
        isSelected: false,
        isVisible: true
      });
    }
  });
  
  // Fisher-Yates洗牌算法，确保随机分布
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  
  return tiles;
}
