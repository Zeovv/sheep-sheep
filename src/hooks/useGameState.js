import { useState, useEffect, useCallback } from 'react';
import { generateTiles } from '../utils/tileGenerator';
import { calculateBlockedTiles } from '../utils/collisionDetection';
import { checkElimination, removeTilesFromSlots, checkWinCondition, checkLoseCondition } from '../utils/eliminationLogic';
import { MAX_SLOTS } from '../utils/constants';

/**
 * 游戏状态管理Hook
 */
export function useGameState() {
  // 游戏状态
  const [tiles, setTiles] = useState([]); // 主游戏区瓦片
  const [slots, setSlots] = useState([]); // 槽位瓦片
  const [score, setScore] = useState(0); // 分数
  const [moves, setMoves] = useState(0); // 移动步数
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost

  // 初始化游戏
  const initializeGame = useCallback(() => {
    // 生成所有瓦片（不再使用盲盒）
    const allTiles = generateTiles();

    // 计算遮挡状态
    const tilesWithBlocked = calculateBlockedTiles(allTiles);

    setTiles(tilesWithBlocked);
    setSlots([]);
    setScore(0);
    setMoves(0);
    setGameStatus('playing');
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

    // 检查槽位是否已满
    if (slots.length >= MAX_SLOTS) {
      return; // 槽位已满，无法添加
    }

    // 将瓦片移动到槽位
    const newTiles = tiles.filter(t => t.id !== tileId);
    const newSlots = [...slots, { ...tile, isSelected: false }];

    // 重新计算遮挡状态
    const tilesWithBlocked = calculateBlockedTiles(newTiles);

    setTiles(tilesWithBlocked);
    setSlots(newSlots);
    setMoves(prev => prev + 1);
  }, [tiles, slots, gameStatus]);

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

    // 检查胜利条件（不再检查盲盒）
    if (checkWinCondition(tiles, [], [], slots)) {
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
  }, [tiles, slots, gameStatus]);

  // 重新开始游戏
  const restartGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  return {
    // 状态
    tiles,
    slots,
    score,
    moves,
    gameStatus,

    // 操作方法
    handleTileClick,
    restartGame
  };
}
