import React from 'react';

/**
 * 游戏状态组件
 * @param {Object} props
 * @param {number} props.score - 当前分数
 * @param {number} props.moves - 移动步数
 * @param {string} props.gameStatus - 游戏状态（playing, won, lost）
 * @param {Function} props.onRestart - 重新开始游戏回调
 * @param {number} props.tilesRemaining - 剩余瓦片数
 * @param {number} props.slotsUsed - 已使用槽位数
 * @param {number} props.maxSlots - 最大槽位数
 * @param {string} props.className - 额外的CSS类
 */
function GameStatus({
  score = 0,
  moves = 0,
  gameStatus = 'playing',
  onRestart,
  tilesRemaining = 0,
  slotsUsed = 0,
  maxSlots = 7,
  className = ''
}) {
  // 游戏状态显示
  const statusConfig = {
    playing: {
      emoji: '🎮',
      title: '游戏中',
      description: '继续消除瓦片！',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      textColor: 'text-white'
    },
    won: {
      emoji: '🏆',
      title: '胜利！',
      description: '恭喜你清除了所有瓦片！',
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      textColor: 'text-white'
    },
    lost: {
      emoji: '💀',
      title: '游戏结束',
      description: '槽位已满，无法继续消除。',
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      textColor: 'text-white'
    }
  };

  const status = statusConfig[gameStatus] || statusConfig.playing;

  return (
    <div className={`rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* 状态横幅 */}
      <div className={`${status.color} ${status.textColor} p-6 text-center`}>
        <div className="text-5xl mb-3">{status.emoji}</div>
        <h1 className="text-3xl font-bold mb-2">{status.title}</h1>
        <p className="text-lg opacity-90">{status.description}</p>
      </div>

      {/* 游戏数据 */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6">
        {/* 分数和步数 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {score}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span className="text-2xl">⭐</span> 分数
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {moves}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span className="text-2xl">👣</span> 步数
            </div>
          </div>
        </div>

        {/* 游戏进度 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            游戏进度
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  剩余瓦片
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {tilesRemaining}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                  style={{ width: `${Math.min(100, (tilesRemaining / 30) * 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  槽位使用 ({slotsUsed}/{maxSlots})
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {Math.round((slotsUsed / maxSlots) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    slotsUsed >= maxSlots
                      ? 'bg-gradient-to-r from-red-400 to-red-600'
                      : slotsUsed > maxSlots * 0.7
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                      : 'bg-gradient-to-r from-blue-400 to-blue-600'
                  }`}
                  style={{ width: `${(slotsUsed / maxSlots) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 游戏提示 */}
        {gameStatus === 'playing' && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <div className="mr-3 text-2xl">💡</div>
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <strong>游戏提示：</strong>优先移除上层的瓦片，解锁下层瓦片。
                  注意槽位容量，避免填满导致游戏结束。
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  当槽位中出现3个相同瓦片时，它们会自动消除并获得分数。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 active:translate-y-0"
          >
            <span className="text-xl mr-2">🔄</span>
            重新开始游戏
          </button>

          {gameStatus === 'playing' && (
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 active:translate-y-0"
            >
              <span className="text-xl mr-2">📊</span>
              重置页面
            </button>
          )}
        </div>

        {/* 游戏规则 */}
        <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
            游戏规则
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 点击未被遮挡的瓦片将其移动到槽位</li>
            <li>• 当槽位中出现3个相同瓦片时自动消除</li>
            <li>• 槽位最多容纳7个瓦片，满了则游戏结束</li>
            <li>• 消除所有瓦片（包括盲盒）即可获胜</li>
            <li>• 盲盒中的瓦片需要点击盲盒取用</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GameStatus;