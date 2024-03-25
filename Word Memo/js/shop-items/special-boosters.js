import ScoreTracker from '../score.js';

export default [
  'Special Boosters (Multipliers)',
  {
    titles: [
      'Coin',
      'Upgrade',
      'Multiplier'
    ],
    icon: 'dollar',
    price: 380,
    text: ScoreTracker.coinBooster,
    type: 'upgrade',
    increment: 0.08,
    suffix: 'x',
    name: 'Coin Booster',
    listener: x => ScoreTracker.set('coinBooster', x)
  },
  {
    titles: [
      'Score',
      'Upgrade',
      'Multiplier'
    ],
    icon: 'trophy',
    price: 240,
    text: ScoreTracker.scoreBooster,
    type: 'upgrade',
    increment: 0.08,
    suffix: 'x',
    name: 'Score Booster',
    listener: x => ScoreTracker.set('scoreBooster', x)
  }
];
