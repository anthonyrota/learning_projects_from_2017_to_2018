import MemoPage from './memo-page.js';
import GamePage from './game-page.js';
import ScoreTracker from './score.js';
import { countdown } from './timer.js';
import { navigateToTarget } from './navigate.js';

const $gamePage = $('.game-page');
const $finishedPage = $('.finished-page');

const $startAgainButton = $('.finished-game-start-again');

const $winStatement = $('.won-or-loss-statement');
const WON_MESSAGE = 'Congratz!';
const LOST_MESSAGE = 'You Lost!';

const $scoreStatement = $('.score-or-level-message');
const WON_SCORE = 'Your Score';
const LOST_SCORE = 'Yor Reached Level';

class Game {
  constructor() {
    this.countdownLength = 60;
    this.dangerZone = 3;
    
    this.score = ScoreTracker;
    this.temporaryScoreBooster = 1;
    this.difficulty = 1;
    
    this.colorDifficulty = Number(store.get('color-difficulty') || 4);
    this.spinDifficulty = Number(store.get('spin-difficulty') || 16);
    
    this.saveDifficulties();
    
    this.memoPage = null;
    this.gamePage = null;
    this.data = null;
    this.countdown = null;
    
    this.started = false;
    this.ended = false;
    
    this.extraWords = [];
  }
  
  addWords(words) {
    this.extraWords = this.extraWords.concat(words);
  }
  
  saveDifficulties() {
    store.set('color-difficulty', this.colorDifficulty);
    store.set('spin-difficulty', this.spinDifficulty);
  }
  
  memo() {
    this.countdown = countdown(this.countdownLength, this.dangerZone, () => this.start());
    
    this.memoPage = new MemoPage(
      this.difficulty,
      this.difficulty >= this.colorDifficulty,
      this.difficulty >= this.spinDifficulty,
      this.extraWords);
    
    this.data = this.memoPage.getData();
    this.word = this.memoPage.getWord();
    
    this.started = false;
    this.ended = false;
  }
  
  start(alreadyNavigated) {
    if (this.started) {
      return;
    }
    this.started = true;
    
    this.countdown.stop();
    this.countdown = countdown(this.countdownLength, this.dangerZone, () => this.end(false, true));
    
    if (!alreadyNavigated) {
      navigateToTarget($gamePage)();
    }
    
    this.gamePage = new GamePage(this, this.word, this.data, this.difficulty);
  }
  
  end(forfeited, failed) {
    if (!this.started) {
      return;
    }
    
    this.started = false;
    this.ended = true;
    this.countdown.stop();
    
    if (failed) {
      this.fail();
      return;
    }
    
    if (!forfeited) {
      this.won();
    }
    
    this.reset();
  }
  
  won() {
    $startAgainButton.show();
    $winStatement.html(WON_MESSAGE);
    $scoreStatement.html(WON_SCORE);
    
    this.score.update(this.temporaryScoreBooster, this.countdown.getTime(), this.countdownLength, this.difficulty, this.gamePage.mistakes, true);
    
    setTimeout(() => navigateToTarget($finishedPage)(), 600);
  }
  
  fail() {
    $startAgainButton.hide();
    $winStatement.html(LOST_MESSAGE);
    $scoreStatement.html(LOST_SCORE);
    
    this.score.update(0, 0, 0, this.difficulty, 0, false);
    
    this.gamePage.fail(() => {
      setTimeout(() => navigateToTarget($finishedPage)(), 600);
    });
  }
  
  reset() {
    this.memoPage = null;
    this.gamePage = null;
  }
  
  finished(forfeited) {
    this.end(forfeited);
    
    this.data = null;
    
    if (this.countdown) {
      this.countdown.stop();
    }
  }
  
  restart(alreadyNavigated) {
    this.finished();
    this.difficulty += 1;
    this.memo(alreadyNavigated);
  }
  
  clear(forfeited) {
    this.finished(forfeited);
    this.difficulty = 1;
    this.temporaryScoreBooster = 1;
    this.extraWords = [];
  }
}

export default new Game();
