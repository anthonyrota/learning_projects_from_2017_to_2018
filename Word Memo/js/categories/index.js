import animals from './animals.js';
import cities from './cities.js';
import emotions from './emotions.js';
import food from './food.js';
import colors from './colors.js';
import sports from './sport.js';

import { prepare } from '../random-word.js';

export default function applyWordList(inventory) {
  [
    ['Animals', animals],
    ['US Cities', cities],
    ['Emotions', emotions],
    ['Food', food],
    ['Colors', colors],
    ['Sports', sports]
  ]
  .forEach(([ name, words ]) => inventory.defineWordCategory(name, prepare(words)));
}
