import { useState, useEffect, useCallback } from 'react';
import { generateTiles, initializeBlindBoxes } from '../utils/tileGenerator';
import { calculateBlockedTiles } from '../utils/collisionDetection';
import { checkElimination, removeTilesFromSlots, checkWinCondition, checkLoseCondition } from '../utils/eliminationLogic';
import { MAX_SLOTS, TOTAL_TILES, BLIND_BOX_TILES_PER_SIDE } from '../utils/constants';

/**
 * 游戏状态管理Hook
 */
export function useGameState() {
  // 游戏状态
  const [tiles, setTiles] = useState([]); // 主游戏区瓦片
  const [leftBox, setLeftBox] = useState([]); // 左侧盲盒
  const [rightBox, setRightBox] = useState([]); // 右侧盲盒
  const [slots, setSlots] = useState([]); // 槽位瓦片
  const [score, setScore] = useState(0); // 分数
  const [moves, setMoves] = useState(0); // 移动步数
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
  const [selectedTileId, setSelectedTileId] = useState(null); // 当前选中的瓦片ID

  // 初始化游戏
  const initializeGame = useCallback(() => {
    // 生成所有瓦片
    const allTiles = generateTiles(TOTAL_TILES);

    // 初始化盲盒
    const { leftBox: left, rightBox: right, remainingTiles } =
      initializeBlindBoxes(allTiles, 1, BLIND_BOX_TILES_PER_SIDE);

    // 计算遮挡状态
    const tilesWithBlocked = calculateBlockedTiles(remainingTiles);

    setTiles(tilesWithBlocked);
    setLeftBox(left);
    setRightBox(right);
    setSlots([]);
    setScore(0);
    setMoves(0);
    setGameStatus('playing');
    setSelectedTileId(null);
  }, []);

  // 游戏初始化
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // 点击主游戏区瓦片
  const handleTileClick = useCallback((tileId) => {
    if (gameStatus !== 'playing') return;

    const tile = tiles.find(t => t.id === tileId);
    if (!tile || tile.isBlocked) return;

    // 将瓦片移动到槽位
    const newTiles = tiles.filter(t => t.id !== tileId);
    const newSlots = [...slots, { ...tile, isSelected: false }];

    // 重新计算遮挡状态
    const tilesWithBlocked = calculateBlockedTiles(newTiles);

    setTiles(tilesWithBlocked);
    setSlots(newSlots);
    setMoves(prev => prev + 1);
    setSelectedTileId(null);
  }, [tiles, slots, gameStatus]);

  // 点击盲盒
  const handleBlindBoxClick = useCallback((side) => {
    if (gameStatus !== 'playing') return;

    const box = side === 'left' ? leftBox : rightBox;
    if (box.length === 0) return;

    // 取出盲盒中的第一个瓦片
    const takenTile = box[0];
    const newBox = box.slice(1).map((tile, index) =>
      index === 0 ? { ...tile, isVisible: true } : tile
    );

    // 将瓦片移动到槽位
    const newSlots = [...slots, { ...takenTile, isSelected: false }];

    // 更新盲盒
    if (side === 'left') {
      setLeftBox(newBox);
    } else {
      setRightBox(newBox);
    }

    setSlots(newSlots);
    setMoves(prev => prev + 1);
    setSelectedTileId(null);
  }, [leftBox, rightBox, slots, gameStatus]);

  // 检查消除条件
  useEffect(() => {
    if (slots.length === 0 || gameStatus !== 'playing') return;

    const eliminationResult = checkElimination(slots);
    if (eliminationResult.canEliminate) {
      // 延迟消除，以便显示动画
      setTimeout(() => {
        const newSlots = removeTilesFromSlots(slots, eliminationResult.tilesToRemove);
        setSlots(newSlots);
        setScore(prev => prev + eliminationResult.typesToEliminate.length * 100);
      }, 300);
    }
  }, [slots, gameStatus]);

  // 检查游戏状态
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    // 检查胜利条件
    if (checkWinCondition(tiles, leftBox, rightBox, slots)) {
      setGameStatus('won');
      return;
    }

    // 检查失败条件
    if (checkLoseCondition(slots, MAX_SLOTS)) {
      // 检查是否还有消除可能
      const eliminationResult = checkElimination(slots);
      if (!eliminationResult.canEliminate) {
        setGameStatus('lost');
      }
    }
  }, [tiles, leftBox, rightBox, slots, gameStatus]);

  // 重新开始游戏
  const restartGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  return {
    // 状态
    tiles,
    leftBox,
    rightBox,
    slots,
    score,
    moves,
    gameStatus,
    selectedTileId,

    // 操作方法
    handleTileClick,
    handleBlindBoxClick,
    restartGame,
    setSelectedTileId
  };
}