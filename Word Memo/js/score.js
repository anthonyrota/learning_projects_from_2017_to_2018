import { shortenNumber } from './helpers.js';
import applyOnChangeAnimation from './score-onchange-animation.js';

const coinsAnimation = applyOnChangeAnimation('.coins', Number(store.get('coins')) || 0);
const highscoreAnimation = applyOnChangeAnimation('.highscore', Number(store.get('highscore')) || 0);

const $highscore = $('.highscore');
const $score = $('.score');
const $coins = $('.coins');

const $stars = $('.star');

const highest = (a, b) => Math.round(a > b ? a : b);

class ScoreTracker {
  constructor() {
    this.highscore = Number(store.get('highscore') || 0);
    this.highestLevel = Number(store.get('highest-level') || 0);
    
    this.coins = Number(store.get('coins') || 0);
    this.highestCoins = Number(store.get('highest-coins') || 0);
    
    this.scoreBooster = Number(store.get('scoreBooster') || 1);
    this.coinBooster = Number(store.get('coinBooster') || 1);
    
    this.updateHTML(false);
  }
  
  set(name, value) {
    this[name] = value;
    store.set(name, value);
  }
  
  save() {
    store.set('highscore', this.highscore);
    store.set('coins', this.coins);
    
    if (this.coins > this.highestCoins) {
      this.highestCoins = this.coins;
      store.set('highest-coins', this.highestCoins);
    }
    
    coinsAnimation(this.coins);
    highscoreAnimation(this.highscore);
  }
  
  update(scoreBooster, time, timeLimit, level, mistakes, didWin) {
    if (level > this.highestLevel) {
      this.highestLevel = level;
      store.set('highest-level', this.highestLevel);
    }
    
    if (didWin) {
      const timeScore = time / timeLimit;
      const score = 5 * timeScore * level;
      
      this.highscore = highest(this.highscore, score * this.scoreBooster * scoreBooster);
      this.coins += Math.round(score * this.coinBooster / 10);
      
      this.updateHTML(Math.round(score * this.scoreBooster * scoreBooster));
      this.updateStars(3 - Math.min(mistakes, 3));
    } else {
      $score.html(level);
      this.updateStars(0);
    }
    
    this.save();
  }
  
  updateHTML(score) {
    if (score !== false) {
      $score.html(shortenNumber(score));
    }
    $coins.html(shortenNumber(this.coins));
    $highscore.html(shortenNumber(this.highscore));
  }
  
  updateStars(number) {
    $stars.each((i, star) => {
      if (i + 1 <= number) {
        $(star).addClass('gold-text');
      } else {
        $(star).removeClass('gold-text');
      }
    });
  }
  
  getCoins() {
    return this.coins;
  }
  
  removeCoins(amount) {
    this.coins -= amount;
    this.save();
    this.updateHTML(false);
  }
}

export default new ScoreTracker();
