import { randomInt } from './helpers.js';
import { BRIGHT_COLORS } from './color.js';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SPIN_CLASSES = ['spin-left', 'spin-right'];

export const COLORS = BRIGHT_COLORS;

export function randomLetter() {
  const index = randomInt(0, LETTERS.length - 1);
  return LETTERS.charAt(index);
}

export function biasedLetter(letters, bias) {
  const pool = LETTERS + letters.repeat(bias);
  const index = randomInt(0, pool.length - 1);
  return pool.toUpperCase().charAt(index);
}

export function randomColor() {
  const index = randomInt(0, COLORS.length - 1);
  return COLORS[index];
}

export function randomSpin() {
  const index = randomInt(0, SPIN_CLASSES.length - 1);
  return SPIN_CLASSES[index];
}

export function generateData(letter) {
  const main = {
    letter: letter.toUpperCase(),
    color: randomColor(),
    spin: randomSpin()
  };
  
  const data = [
    {
      label: 'Letter',
      letter: main.letter,
      color: randomColor(),
      spin: randomSpin()
    },
    {
      label: 'Color',
      letter: randomLetter(),
      color: main.color,
      spin: randomSpin()
    },
    {
      label: 'Spin',
      letter: randomLetter(),
      color: randomColor(),
      spin: main.spin
    }
  ];
  
  data.main = main;
  
  return data;
}

export function setData(data, option, value) {
  data.main[option] = value;
  data.forEach(d => d[option] = value);
}

export function extractData(data) {
  return data.main;
}

export function isDuplicateLetter(options, wordData) {
  return wordData.some(data => {
    return (data.letter === options.letter)
        && (!data.color || !options.color || data.color === options.color)
        && (!data.spin || !options.spin || data.spin === options.spin);
  });
}

export class Letter {
  constructor({ letter, color, spin }) {
    this.html = spin
      ? $(`<div class="letter ${spin}">${letter}</div>`)
      : $(`<div class="letter">${letter}</div>`);
    
    if (color) {
      this.html.css('color', color);
    }
  }
  
  getHTML() {
    return this.html;
  }
}
