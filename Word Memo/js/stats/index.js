import sessionTimePlayed from './session-time-played.js';
import totalTimePlayed from './total-time-played.js';
import coins from './coins.js';
import highestCoins from './highest-coins.js';
import highestLevel from './highest-level.js';
import highscore from './highscore.js';
import scoreBooster from './score-booster.js';
import coinBooster from './coin-booster.js';
import colorDifficulty from './color-difficulty.js';
import spinDifficulty from './spin-difficulty.js';

import maxInventory from './max-inventory.js';
import dailyRewards from './daily-rewards.js';

export default function applyStats(Constructor) {
  const stats = new Constructor();
  
  [
    sessionTimePlayed,
    totalTimePlayed,
    coins,
    highestCoins,
    highestLevel,
    scoreBooster,
    coinBooster,
    colorDifficulty,
    spinDifficulty,
    highscore,
    
    ...dailyRewards,
    ...maxInventory
  ]
  .forEach(([ title, func ]) => stats.define(title, func));
  
  stats.render();
  
  return stats;
}
