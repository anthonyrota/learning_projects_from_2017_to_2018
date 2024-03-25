import game from '../game.js';

export default [
  'Decrease Difficulty',
  {
    titles: [
      'Color',
      'Upgrade',
      'Minimum Level'
    ],
    icon: 'paint-brush',
    price: 750,
    text: game.colorDifficulty,
    type: 'upgrade',
    increment: 1,
    name: 'Color Starting Level',
    listener: x => {
      game.colorDifficulty++;
      game.saveDifficulties();
    }
  },
  {
    titles: [
      'Spin',
      'Upgrade',
      'Minimum Level'
    ],
    icon: 'spinner fa-pulse',
    price: 1850,
    text: game.spinDifficulty,
    type: 'upgrade',
    increment: 1,
    name: 'Spin Starting Level',
    listener: x => {
      game.spinDifficulty++;
      game.saveDifficulties();
    }
  }
];
