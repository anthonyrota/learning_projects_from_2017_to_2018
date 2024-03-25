import randomWord from './random-word.js';
import {
  generateData,
  extractData,
  setData,
  isDuplicateLetter,
  Letter
} from './letter.js';

const $container = $('.game-card-container');
const $word = $('.word');

class Card {
  constructor(letter, data, hasColor, hasSpin) {
    this.container = $('<div class="card shadow-dark">');
    this.content = $('<ul class="card-content flex-center">');
    
    const item = new Item(letter, this.content, data, hasColor, hasSpin);
    this.data = item.getData();
    
    this.container.append(this.content);
  }
  
  getData() {
    return this.data;
  }
  
  getHTML() {
    return this.container;
  }
}

class Item {
  constructor(letter, container, wordData, hasColor, hasSpin) {
    while (true) {
      const data = generateData(letter);
      
      if (!hasColor) setData(data, 'color', null);
      if (!hasSpin) setData(data, 'spin', null);
      
      if (!isDuplicateLetter(extractData(data), wordData)) {
        this.data = data;
        break;
      }
    }
    
    if (!hasSpin) {
      this.data.length = hasColor ? 2 : 1;
    }
    
    this.mainData = extractData(this.data);
    
    this.data.forEach(data => container.append(this.createLetter(data)));
  }
  
  createLetter(data) {
    const letter = new Letter(data);
    
    const li = $('<li class="card-item flex-center">');
    const label = $(`<div class="letter-label">${data.label}</div>`);
    
    li.append(label);
    li.append(letter.getHTML());
    
    return li;
  }
  
  getData() {
    return this.mainData;
  }
}

const MIN_DIFFICULTY = 2;
const DIFFICULTY_STEPS = 8;
const DIFFICULTY_RANGE = 1;

export default class MemoPage {
  constructor(difficulty, hasColor, hasSpin, extraWords) {
    const min = Math.floor(difficulty / DIFFICULTY_STEPS) + MIN_DIFFICULTY;
    
    if (extraWords.length > 0) {
      this.word = randomWord(min, min + DIFFICULTY_RANGE, !hasColor, extraWords);
    } else {
      this.word = randomWord(min, min + DIFFICULTY_RANGE, !hasColor);
    }
    
    this.word = this.word.toLowerCase();
    
    this.data = [];
    
    $container.empty();
    
    this.word.split('').forEach(letter => {
      const card = new Card(letter, this.data, hasColor, hasSpin);
      
      this.data.push(card.getData());
      $container.append(card.getHTML());
    });
    
    $word.html(this.word);
  }
  
  getData() {
    return this.data;
  }
  
  getWord() {
    return this.word;
  }
}
