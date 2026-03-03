// 游戏常量配置 - 增加到13种牌
export const TILE_TYPES = [
  '🐑', '🌽', '🥕', '🔔', '🍎', '🍌', '🍇', '🍒',
  '🌿', '🌻', '🌺', '🌸', '🌼'
];

// 游戏核心配置
export const MAX_SLOTS = 7; // 槽位数量
export const ELIMINATION_COUNT = 3; // 消除所需数量

// 虚拟网格（Unit）配置
// 定义一个基础 Unit 网格，GameBoard 宽度方向 14 个 Unit，高度方向 20 个 Unit
// 单个瓦片占用 2x2 Unit
export const UNIT_COLS = 14; // 水平方向 Unit 数量
export const UNIT_ROWS = 20; // 垂直方向 Unit 数量
export const TILE_UNIT_SIZE = 2; // 单个瓦片宽/高占用的 Unit 数量

// 兼容旧逻辑的网格常量（不再用于精确布局）
export const GRID_SIZE = 7;
export const GRID_UNIT = 1;

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
