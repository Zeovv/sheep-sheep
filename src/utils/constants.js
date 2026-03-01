// 游戏常量配置 - 增加到13种牌
export const TILE_TYPES = [
  '🐑', '🌽', '🥕', '🔔', '🍎', '🍌', '🍇', '🍒',
  '🌿', '🌻', '🌺', '🌸', '🌼'
];

// 游戏核心配置
export const MAX_SLOTS = 7; // 槽位数量
export const ELIMINATION_COUNT = 3; // 消除所需数量
export const GRID_SIZE = 7; // 7×7网格系统
export const GRID_UNIT = 0.5; // 网格单位（0.5倍细分，实现更灵活的堆叠）

// 瓦片配置
export const TILE_WIDTH = 50; // 瓦片宽度（像素）
export const TILE_HEIGHT = 50; // 瓦片高度（像素）
export const TILE_BORDER_RADIUS = 8; // 圆角

// 游戏区域配置
export const GAME_BOARD_WIDTH = 350; // 游戏板宽度（像素）
export const GAME_BOARD_HEIGHT = 500; // 游戏板高度（像素）
export const BOARD_PADDING = 10; // 内边距

// 游戏难度配置
export const MIN_LAYERS = 4; // 最小层数
export const MAX_LAYERS = 6; // 最大层数
export const TOTAL_TILES = 240; // 总瓦片数（固定240张）

// 动画配置
export const ANIMATION_DURATION = 300; // 动画持续时间（毫秒）
export const ELIMINATION_ANIMATION_DURATION = 500; // 消除动画时长
