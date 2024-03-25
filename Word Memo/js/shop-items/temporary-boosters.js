import game from '../game.js';

export default [
  'Temporary Score Boosters<br>(Only Lasts One Game)',
  {
    titles: [
      'Tiny',
      'Purchase',
      'Score Boost'
    ],
    icon: 'trophy',
    price: 180,
    text: '1.5x',
    type: 'item',
    name: 'Tiny Score Booster',
    listener: () => game.temporaryScoreBooster = 1.5
  },
  {
    titles: [
      'Small',
      'Purchase',
      'Score Boost'
    ],
    icon: 'trophy',
    price: 385,
    text: '2x',
    type: 'item',
    name: 'Small Score Booster',
    listener: () => game.temporaryScoreBooster = 2
  },
  {
    titles: [
      'Medium',
      'Purchase',
      'Score Boost'
    ],
    icon: 'trophy',
    price: 2250,
    text: '5x',
    type: 'item',
    name: 'Medium Score Booster',
    listener: () => game.temporaryScoreBooster = 5
  },
  {
    titles: [
      'Epic',
      'Purchase',
      'Score Boost'
    ],
    icon: 'trophy',
    price: 7500,
    text: '10x',
    type: 'item',
    name: 'Epic Score Booster',
    listener: () => game.temporaryScoreBooster = 10
  },
];
