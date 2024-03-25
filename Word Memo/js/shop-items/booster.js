import game from '../game.js';

export default [
  'Boosters (Increase Starting Level)',
  {
    titles: [
      'Small',
      'Purchase',
      'Start Level Increase'
    ],
    icon: 'rocket',
    price: 20,
    text: '3',
    type: 'item',
    name: 'Small Booster',
    listener: () => game.difficulty += 3 - 1
  },
  {
    titles: [
      'Medium',
      'Purchase',
      'Start Level Increase'
    ],
    icon: 'rocket',
    price: 85,
    text: '7',
    type: 'item',
    name: 'Medium Booster',
    listener: () => game.difficulty += 7 - 1
  },
  {
    titles: [
      'Mega',
      'Purchase',
      'Start Level Increase'
    ],
    icon: 'rocket',
    price: 435,
    text: '16',
    type: 'item',
    name: 'Mega Booster',
    listener: () => game.difficulty += 16 - 1
  }
];
