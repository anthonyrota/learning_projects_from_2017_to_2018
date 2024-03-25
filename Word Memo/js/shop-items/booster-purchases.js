import game from '../game.js';

export default [
  'Lifetime Boosters<br>(One Time Only)',
  {
    titles: [
      'Coin',
      'Buy From Store',
      '10x Coins Booster'
    ],
    icon: 'dollar',
    price: 19.95,
    text: '10',
    suffix: 'x',
    type: 'purchase',
    name: '10x Coin Booster',
    listener: name => console.log('Bought', name)
  },
  {
    titles: [
      'Score',
      'Buy From Store',
      '10x Score Booster'
    ],
    icon: 'trophy',
    price: 19.95,
    text: '10',
    suffix: 'x',
    type: 'purchase',
    name: '10x Score Booster',
    listener: name => console.log('Bought', name)
  }
];
