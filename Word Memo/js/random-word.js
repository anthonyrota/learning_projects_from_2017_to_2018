import { randomInt } from './helpers.js';
import { COLORS } from './letter.js';
import wordBank from './words.js';

const COLORS_LENGTH = COLORS.length;
const minOfLength = 8;

const _words = prepare(wordBank);
const _MIN_LENGTH = _words.reduce((min, { length }) => Math.min(min, length), Infinity);
const _MAX_LENGTH = _words.reduce((max, { length }) => Math.max(max, length), 0);

export function prepare(words) {
  const filtered = words.filter(word => amountOfCharsRepeating(word) < COLORS_LENGTH);
  return getAllAboveLength(filtered);
}

function getAllAboveLength(words) {
  let map = [];
  
  for (const word of words) {
    const l = word.length;
    
    if (!map[l]) {
      map[l] = [];
    }
    
    map[l].push(word);
  }
  
  return map
    .filter(arr => arr.length >= minOfLength)
    .reduce((acc, arr) => acc.concat(arr), []);
}

function amountOfCharsRepeating(str) {
  try {
    return str.toLowerCase().split('').sort().join('').match(/(.)\1+/g).length;
  } catch (e) {
    return 0;
  }
}

function isNotRepeating(str) {
  return amountOfCharsRepeating(str) === 0;
}

const fallback = _words.filter(word => word.length >= 3 && word.length <= 5);

export default function randomWord(min, max, noDuplicateLetter, wordBank) {
  let words = _words;
  let MIN_LENGTH = _MIN_LENGTH;
  let MAX_LENGTH = _MAX_LENGTH;
  
  if (wordBank) {
    words = wordBank;
    MIN_LENGTH = words.reduce((min, { length }) => Math.min(min, length), Infinity);
    MAX_LENGTH = words.reduce((max, { length }) => Math.max(max, length), 0);
  }
  
  min = Math.max(Math.min(min, MAX_LENGTH), MIN_LENGTH);
  max = Math.max(Math.min(max, MAX_LENGTH), MIN_LENGTH);
  
  let pool = words.filter(word => word.length >= min && word.length <= max);
  
  if (noDuplicateLetter) {
    pool = pool.filter(isNotRepeating);
  }
  
  const index = randomInt(0, pool.length);
  
  if (!pool[index]) {
    const index = randomInt(0, fallback.length);
    return fallback[index];
  }
  
  return pool[index];
}
