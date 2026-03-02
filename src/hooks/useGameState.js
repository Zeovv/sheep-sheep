import { useState, useEffect, useCallback } from 'react';
import { generateTiles } from '../utils/tileGenerator';
import { calculateBlockedTiles } from '../utils/collisionDetection';
import { checkElimination, removeTilesFromSlots, checkWinCondition, checkLoseCondition } from '../utils/eliminationLogic';
import { MAX_SLOTS } from '../utils/constants';

/**
 * 游戏状态管理Hook
 */
export function useGameState() {
  const [tiles, setTiles] = useState(() => calculateBlockedTiles(generateTiles()));
  const [slots, setSlots] = useState([]); // 槽位瓦片
  const [score, setScore] = useState(0); // 分数
  const [moves, setMoves] = useState(0); // 移动步数
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost

  const evaluateGameStatus = useCallback((nextTiles, nextSlots) => {
    if (checkWinCondition(nextTiles, [], [], nextSlots)) {
      return 'won';
    }
    if (checkLoseCondition(nextSlots, MAX_SLOTS)) {
      const eliminationResult = checkElimination(nextSlots);
      if (!eliminationResult.canEliminate) {
        return 'lost';
      }
    }
    return 'playing';
  }, []);

  // 初始化游戏
  const initializeGame = useCallback(() => {
    const allTiles = generateTiles();
    const tilesWithBlocked = calculateBlockedTiles(allTiles);

    setTiles(tilesWithBlocked);
    setSlots([]);
    setScore(0);
    setMoves(0);
    setGameStatus('playing');
  }, []);

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
    setGameStatus(evaluateGameStatus(tilesWithBlocked, newSlots));
  }, [tiles, slots, gameStatus, evaluateGameStatus]);

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
        setGameStatus(evaluateGameStatus(tiles, newSlots));
      }, 300);
    }
  }, [slots, gameStatus, tiles, evaluateGameStatus]);

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
