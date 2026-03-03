import {
  TILE_TYPES,
  UNIT_COLS,
  UNIT_ROWS,
  GAME_BOARD_WIDTH,
  GAME_BOARD_HEIGHT,
  TILE_WIDTH,
  TILE_HEIGHT,
  BOARD_PADDING,
  TOTAL_TILES,
  MIN_LAYERS,
  MAX_LAYERS,
  TILE_UNIT_SIZE
} from './constants';

/**
 * Unit 坐标系说明：
 * - 整个 GameBoard 被划分为 UNIT_COLS x UNIT_ROWS 个 Unit。
 * - 每个瓦片（Tile）大小为 2x2 Unit（由 TILE_UNIT_SIZE 控制）。
 * - unitX, unitY 表示瓦片左上角在 Unit 网格中的整数坐标。
 */

// 将 Unit 坐标转换为像素坐标
function unitToPixel(unitX, unitY) {
  const unitWidth = (GAME_BOARD_WIDTH - BOARD_PADDING * 2) / UNIT_COLS;
  const unitHeight = (GAME_BOARD_HEIGHT - BOARD_PADDING * 2) / UNIT_ROWS;

  let x = BOARD_PADDING + unitX * unitWidth;
  let y = BOARD_PADDING + unitY * unitHeight;

  const maxX = GAME_BOARD_WIDTH - BOARD_PADDING - TILE_WIDTH;
  const maxY = GAME_BOARD_HEIGHT - BOARD_PADDING - TILE_HEIGHT;

  x = Math.max(BOARD_PADDING, Math.min(x, maxX));
  y = Math.max(BOARD_PADDING, Math.min(y, maxY));

  return { x, y };
}

// 生成随机分配但保证每种牌都是 3 的倍数的数量
function generateTileCounts(totalTiles, typeCount) {
  const counts = new Array(typeCount).fill(0);
  const minPerType = 3;
  const baseTotal = minPerType * typeCount;

  for (let i = 0; i < typeCount; i++) {
    counts[i] = minPerType;
  }

  let remaining = totalTiles - baseTotal;

  while (remaining > 0) {
    const randomIndex = Math.floor(Math.random() * typeCount);
    const addAmount = Math.min(3, Math.floor(remaining / 3) * 3);

    if (addAmount >= 3) {
      counts[randomIndex] += addAmount;
      remaining -= addAmount;
    } else {
      break;
    }
  }

  const currentTotal = counts.reduce((sum, count) => sum + count, 0);
  const diff = totalTiles - currentTotal;
  if (diff !== 0 && diff % 3 === 0) {
    counts[counts.length - 1] += diff;
  }

  return counts.map(count => {
    const remainder = count % 3;
    if (remainder !== 0) {
      return count - remainder;
    }
    return count;
  });
}

// 生成底层（layer 0）的不重叠瓦片位置，尽量铺满整个棋盘
function generateBaseLayerPositions() {
  const positions = [];
  const maxUnitX = UNIT_COLS - TILE_UNIT_SIZE;
  const maxUnitY = UNIT_ROWS - TILE_UNIT_SIZE;

  for (let uy = 0; uy <= maxUnitY; uy += TILE_UNIT_SIZE) {
    for (let ux = 0; ux <= maxUnitX; ux += TILE_UNIT_SIZE) {
      positions.push({ unitX: ux, unitY: uy, layer: 0 });
    }
  }

  return positions;
}

// 允许的堆叠偏移（单位：Unit），严格遵守题目给出的规则
// 1/4 覆盖: (±1, ±1)
// 1/2 覆盖: (±1, 0) 或 (0, ±1)
// 完全重合: (0, 0)
const STACK_OFFSETS = [
  { dx: 0, dy: 0 },
  { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
  { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
  { dx: 1, dy: 1 }, { dx: -1, dy: 1 },
  { dx: 1, dy: -1 }, { dx: -1, dy: -1 },
];

// 基于底层位置，按照物理规则生成上层堆叠位置
function generateStackedPositions(basePositions, layers, totalTiles) {
  const allPositions = [...basePositions];
  const positionsByLayer = { 0: basePositions };

  const maxUnitX = UNIT_COLS - TILE_UNIT_SIZE;
  const maxUnitY = UNIT_ROWS - TILE_UNIT_SIZE;

  for (let layer = 1; layer < layers && allPositions.length < totalTiles; layer++) {
    const currentLayer = [];
    const lowerLayerPositions = positionsByLayer[layer - 1] || basePositions;
    const used = new Set();

    lowerLayerPositions.forEach((pos, index) => {
      // 控制堆叠密度：不是每个底层瓦片都生成上层瓦片
      if (allPositions.length >= totalTiles) return;
      if (Math.random() > 0.7) return;

      const pattern = STACK_OFFSETS[index % STACK_OFFSETS.length];
      const ux = pos.unitX + pattern.dx;
      const uy = pos.unitY + pattern.dy;

      if (ux < 0 || uy < 0 || ux > maxUnitX || uy > maxUnitY) return;

      const key = `${layer}_${ux}_${uy}`;
      if (used.has(key)) return;
      used.add(key);

      const stackedPos = { unitX: ux, unitY: uy, layer };
      currentLayer.push(stackedPos);
      allPositions.push(stackedPos);
    });

    positionsByLayer[layer] = currentLayer;
  }

  return allPositions;
}

// 简单洗牌
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 生成瓦片数组（遵守严格的物理规则）：
 * - 使用 Unit 网格，瓦片大小为 2x2 Unit。
 * - 上下层之间的偏移量仅允许 (0,0), (±1,0), (0,±1), (±1,±1)。
 * - 不存在任意小数偏移，确保堆叠视觉规律性。
 */
export function generateTiles(totalTiles = TOTAL_TILES, layers = null) {
  if (!layers) {
    layers = Math.floor(Math.random() * (MAX_LAYERS - MIN_LAYERS + 1)) + MIN_LAYERS;
  }

  totalTiles = Math.ceil(totalTiles / 3) * 3;

  const baseLayer = generateBaseLayerPositions();
  let positions = generateStackedPositions(baseLayer, layers, totalTiles);

  if (positions.length < totalTiles) {
    const extra = [];
    const maxUnitX = UNIT_COLS - TILE_UNIT_SIZE;
    const maxUnitY = UNIT_ROWS - TILE_UNIT_SIZE;

    for (let i = 0; i < positions.length && positions.length + extra.length < totalTiles; i++) {
      const pos = positions[i];
      const pattern = STACK_OFFSETS[i % STACK_OFFSETS.length];
      const ux = pos.unitX + pattern.dx;
      const uy = pos.unitY + pattern.dy;
      if (ux < 0 || uy < 0 || ux > maxUnitX || uy > maxUnitY) continue;
      extra.push({ unitX: ux, unitY: uy, layer: pos.layer + 1 });
    }

    positions = positions.concat(extra);
  }

  if (positions.length > totalTiles) {
    positions = shuffle(positions).slice(0, totalTiles);
  }

  const tileCounts = generateTileCounts(totalTiles, TILE_TYPES.length);
  const typePool = [];
  TILE_TYPES.forEach((type, idx) => {
    for (let i = 0; i < tileCounts[idx]; i++) {
      typePool.push(type);
    }
  });
  const shuffledTypes = shuffle(typePool);

  const tiles = [];
  positions.forEach((pos, index) => {
    const type = shuffledTypes[index % shuffledTypes.length];
    const pixelPos = unitToPixel(pos.unitX, pos.unitY);

    tiles.push({
      id: `tile_${index}`,
      type,
      layer: pos.layer,
      unitX: pos.unitX,
      unitY: pos.unitY,
      x: pixelPos.x,
      y: pixelPos.y,
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
      isBlocked: false,
      isSelected: false,
      isVisible: true,
    });
  });

  return tiles;
}
