import {
  Letter,
  isDuplicateLetter,
  randomLetter,
  randomColor,
  randomSpin,
  biasedLetter
} from './letter.js';
import { randomInt } from './helpers.js';
import ScoreTracker from './score.js';

const $container = $('.game-grid');
const $progress = $('.word-progress');
const $hint = $('.get-hint');

class Grid {
  constructor (rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.letters = [];
    
    this.container = $('<div class="grid shadow-dark">');
    
    for (let i = 0; i < rows; i++) {
      const $row = $('<div class="row">');
      this.letters[i] = [];
      
      for (let j = 0; j < cols; j++) {
        const $col = $('<div class="col flex-center"></div>');
        $row.append($col);
        
        this.letters[i][j] = $col;
      }
      
      this.container.append($row);
    }
  }
  
  getHTML() {
    return this.container;
  }
  
  getData() {
    return this.letters;
  }
}

const DIMENSIONS = 4 / 5;

const MIN_HEIGHT = 4;
const MAX_HEIGHT = 8;

const STEP = 8;

const HINT_GET_ALL_COST = 40;
const HINT_GET_NEXT_COST = 100;

export default class GamePage {
  constructor(parent, word, wordData, difficulty) {
    const height = Math.min(MIN_HEIGHT + Math.floor(difficulty / STEP), MAX_HEIGHT);
    const width = Math.round(height / DIMENSIONS);
    
    this.parent = parent;
    this.grid = new Grid(width, height);
    
    this.container = this.grid.getHTML();
    this.data = this.grid.getData();
    
    this.wordData = wordData;
    this.word = word.split('');
    this.wordIndex = 0;
    
    this.wordHTML = [];
    
    this.hintID = 0;
    this.mistakes = 0;
    this.revealed = false;
    
    let mapped = Array(this.data.length).fill(0).map(() => []);
    
    let hasColor = true;
    let hasSpin = true;
    
    this.word.forEach((letter, i) => {
      const data = wordData[i];
      
      if (!data.color) hasColor = false;
      if (!data.spin) hasSpin = false;
      
      while (true) {
        const x = randomInt(0, width - 1);
        const y = randomInt(0, height - 1);
        
        if (!mapped[x][y]) {
          const letter = new Letter(data).getHTML();
          
          this.data[x][y].fastClick(() => this.handleLetterClicked(i, this.data[x][y]));
          this.data[x][y].append(letter);
          
          this.wordHTML.push(this.data[x][y]);
          mapped[x][y] = true;
          break;
        }
      }
    });
    
    this.hasColor = hasColor;
    this.hasSpin = hasSpin;
    
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (!mapped[i][j]) {
          while (true) {
            const options = {
              letter: biasedLetter(word, 3),
              color: hasColor ? randomColor() : null,
              spin: hasSpin ? randomSpin() : null
            };
            
            if (!isDuplicateLetter(options, wordData)) {
              const letter = new Letter(options).getHTML();
              
              this.data[i][j].fastClick(() => this.handleWrongLetterClicked(this.data[i][j]));
              this.data[i][j].append(letter);
              mapped[i][j] = true;
              break;
            }
          }
        }
      }
    }
    
    $container.empty();
    $container.append(this.container);
    
    this.displayWord();
    
    $hint.off();
    $hint.fastClick(() => this.hint());
  }
  
  cancelHint(message) {
    this.handleOverlay($container, 'red-overlay-clicked');
    
    swal('OOPS', message, 'error');
  }
  
  continueHint() {
    this.handleOverlay($container, 'green-overlay-clicked');
  }
  
  reveal() {
    if (ScoreTracker.getCoins() < HINT_GET_ALL_COST) {
      this.cancelHint(`That Requires ${HINT_GET_ALL_COST} Coins`);
      return;
    }
    
    ScoreTracker.removeCoins(HINT_GET_ALL_COST);
    
    this.revealed = true;
    this.displayWord();
    this.continueHint();
    this.hintID = 1;
  }
  
  showNext() {
    if (ScoreTracker.getCoins() < HINT_GET_NEXT_COST) {
      this.cancelHint(`That Requires ${HINT_GET_NEXT_COST} Coins`);
      return;
    }
    
    if (!(this.wordIndex < this.word.length - 1)) {
      this.cancelHint(`You Cannot Use A Hint On The Last Letter!`);
      return;
    }
    
    ScoreTracker.removeCoins(HINT_GET_NEXT_COST);
    
    this.wordIndex++;
    this.displayWord();
    this.continueHint();
    this.hintID = 1;
  }
  
  hint() {
    switch (this.hintID) {
      case 0:
        if (this.hasColor) {
          this.reveal();
        } else {
          this.showNext();
        }
        break;
      
      case 1:
        this.showNext();
        break;
    }
  }
  
  fail(callback) {
    ['handleOverlay', 'handleLetterClicked', 'handleWrongLetterClicked', 'hint'].forEach((func) => {
      this[func] = () => {};
    });
    
    const { length } = this.word;
    
    this.wordIndex = length;
    this.displayWord();
    this.displayWord = () => {};
    
    const DELAY = 150;
    const END_DELAY = 1500;
    let index = 0;
    
    const showNext = () => {
      window.setTimeout(() => {
        if (index < length) {
          this.wordHTML[index].addClass('popout');
        }
        
        if (index > 0 && index <= length) {
          this.wordHTML[index - 1].addClass('popout-animated');
        }
          
        if (index > length) {
          setTimeout(callback, END_DELAY);
          return;
        }
        
        index++;
        showNext();
      }, DELAY);
    };
    
    showNext();
  }
  
  handleOverlay($el, className) {
    $el.removeClass('green-overlay-clicked red-overlay-clicked');
    
    const classes = `overlay-clicked overlay-clicked-active ${className}`;
    
    $el.addClass(classes);
    setTimeout(() => $el.removeClass(classes), 400);
  }
  
  handleLetterClicked(i, $el) {
    i += 1;
    
    if (this.wordIndex + 1 !== i) {
      this.handleWrongLetterClicked($el);
      return;
    }
    this.handleOverlay($el, 'green-overlay-clicked');
    this.wordIndex++;
    
    this.displayWord();
    
    if (this.wordIndex === this.word.length) {
      this.parent.end();
    }
  }
  
  displayWord() {
    const progress = this.word.slice(0, this.wordIndex);
    
    const highlighted = progress.map((letter, i) => {
      return `<span style="color: ${this.wordData[i].color}">${letter}</span>`;
    }).join('');
    
    if (this.revealed) {
      const hidden = this.word.slice(this.wordIndex).join('');
      const camouflaged = `<span class="camouflage">${hidden}</span>`;
      
      $progress.html(highlighted + camouflaged);
    } else {
      $progress.html(highlighted);
    }
  }
  
  handleWrongLetterClicked($el) {
    this.wordIndex = 0;
    this.mistakes++;
    this.displayWord();
    this.handleOverlay($container, 'red-overlay-clicked');
  }
}
