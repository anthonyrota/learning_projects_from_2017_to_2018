import { colorText } from './color.js';
import {
  setupNavigation,
  defineTarget,
  navigateToTarget
} from './navigate.js';
import { countdown } from './timer.js';
import Inventory from './inventory.js';
import game from './game.js';
import Shop from './shop.js';
import Stats from './stats.js';
import { loadSound, playSound } from './sound.js';
import setupDailyRewards from './daily-rewards.js';

setupDailyRewards();

colorText('.rainbow-letters');

const $memoPage = $('.memo-page');

setupNavigation({
  'navigate-home-page': {
    cb: () => game.clear(),
    target: 'home-page'
  },
  
  'navigate-stats-page': {
    cb: () => Stats.update(),
    target: 'stats-page'
  },
  
  'navigate-inventory-page': {
    cb: () => {
      if (Inventory.isEmpty()) {
        game.memo();
        return $memoPage;
      }
      Inventory.render();
    },
    target: 'inventory-page'
  },
  
  'navigate-shop-page': {
    cb: () => {},
    target: 'shop-page'
  },
  
  'navigate-memo-page': {
    cb: () => {
      Inventory.apply();
      game.memo();
    },
    target: 'memo-page'
  },
  
  'navigate-game-page': {
    cb: () => game.start(true),
    target: 'game-page'
  },
  
  'end-game': {
    cb: () => game.clear(true),
    target: 'home-page'
  },
  
  'finished-game-start-again': {
    cb: () => game.restart(true),
    target: 'memo-page'
  },
  
  'finished-game-go-home': {
    cb: () => game.clear(),
    target: 'home-page'
  }
});

const $loadingPage = $('.loading-page');
const $finishedPage = $('.finished-page');
const $homePage = $('.home-page');

defineTarget($loadingPage);
defineTarget($finishedPage);
navigateToTarget($homePage)();
