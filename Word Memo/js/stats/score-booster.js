import ScoreTracker from '../score.js';
import { format } from '../helpers.js';

export default [
  'Score Booster',
  () => format(ScoreTracker.scoreBooster, 'x')
];
