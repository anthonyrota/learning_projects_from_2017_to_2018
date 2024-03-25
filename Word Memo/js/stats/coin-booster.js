import ScoreTracker from '../score.js';
import { format } from '../helpers.js';

export default [
  'Coin Booster',
  () => format(ScoreTracker.coinBooster, 'x')
];
