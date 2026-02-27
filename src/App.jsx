import React from 'react';
import './App.css';
import { useGameState } from './hooks/useGameState';
import GameBoard from './components/GameBoard';
import BlindBox from './components/BlindBox';
import SlotArea from './components/SlotArea';
import GameStatus from './components/GameStatus';
import { MAX_SLOTS } from './utils/constants';

function App() {
  const {
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
  } = useGameState();

  // 计算剩余瓦片总数（包括盲盒中的）
  const totalTilesRemaining = tiles.length + leftBox.length + rightBox.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      {/* 页眉 */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          🐑 羊了个羊 <span className="text-2xl md:text-3xl">堆叠式三消游戏</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          一款类似《羊了个羊》的堆叠式三消游戏。点击未被遮挡的瓦片将其移动到槽位，
          当槽位中出现3个相同的瓦片时，它们会自动消除。清空所有瓦片即可获胜！
        </p>
      </header>

      {/* 主游戏区域 */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* 左侧盲盒 */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <BlindBox
              tiles={leftBox}
              side="left"
              onClick={handleBlindBoxClick}
              className="h-full"
            />
          </div>

          {/* 中间游戏区域 */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {/* 游戏状态 */}
              <GameStatus
                score={score}
                moves={moves}
                gameStatus={gameStatus}
                onRestart={restartGame}
                tilesRemaining={totalTilesRemaining}
                slotsUsed={slots.length}
                maxSlots={MAX_SLOTS}
              />

              {/* 主游戏板 */}
              <GameBoard
                tiles={tiles}
                onTileClick={handleTileClick}
              />
            </div>
          </div>

          {/* 右侧盲盒 */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <BlindBox
              tiles={rightBox}
              side="right"
              onClick={handleBlindBoxClick}
              className="h-full"
            />
          </div>
        </div>

        {/* 槽位区域 */}
        <div className="mt-8 md:mt-12">
          <SlotArea
            slots={slots}
            onSlotClick={(tileId) => {
              // 点击槽位瓦片可以取消选择（可选功能）
              setSelectedTileId(selectedTileId === tileId ? null : tileId);
            }}
          />
        </div>

        {/* 游戏说明 */}
        <div className="mt-8 p-6 bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            🎯 游戏玩法说明
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-xl">
              <div className="text-3xl mb-3">🧱</div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">瓦片堆叠</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                瓦片以多层堆叠方式分布，上层瓦片会遮挡下层瓦片。
                只有未被遮挡的瓦片可以点击选择。
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-xl">
              <div className="text-3xl mb-3">📥</div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">槽位管理</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                底部有7个槽位，用于存放选中的瓦片。
                当槽位中出现3个相同的瓦片时，它们会自动消除并获得分数。
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-xl">
              <div className="text-3xl mb-3">🎁</div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">盲盒系统</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                左右两侧各有1个盲盒，内含堆叠的瓦片。
                只有最前面的瓦片可见，点击盲盒可以取走最前面的瓦片。
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>胜利条件：</strong>清除所有瓦片（包括盲盒中的瓦片）即可获胜。
              <strong>失败条件：</strong>当槽位被填满（达到7个）且无法触发消除时，游戏结束。
            </p>
          </div>
        </div>

        {/* 页脚 */}
        <footer className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            游戏基于 React + Tailwind CSS 构建 • 类似《羊了个羊》的堆叠式三消游戏
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
            使用 Emoji 作为临时图标 • 游戏逻辑使用原生 JavaScript 实现
          </p>
        </footer>
      </div>

      {/* 游戏状态遮罩 */}
      {gameStatus !== 'playing' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="text-6xl mb-6">
              {gameStatus === 'won' ? '🏆' : '💀'}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              {gameStatus === 'won' ? '恭喜获胜！' : '游戏结束'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {gameStatus === 'won'
                ? '你成功清除了所有瓦片！真是太棒了！'
                : '槽位已满，无法继续消除。下次再接再厉！'}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-xl">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {score}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">最终分数</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-xl">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {moves}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">总步数</div>
              </div>
            </div>
            <button
              onClick={restartGame}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-2xl mr-3">🔄</span>
              重新开始游戏
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;