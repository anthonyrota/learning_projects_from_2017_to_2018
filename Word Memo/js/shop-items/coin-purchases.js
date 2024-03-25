import game from '../game.js';

export default [
  'Coins Purchases',
  {
    titles: [
      'Pouch Of<br>Coins',
      'Buy From Store',
      'Gives You This Many Coins'
    ],
    icon: 'dollar',
    price: 0.99,
    text: '4.5k',
    type: 'purchase',
    name: 'Buy 4500 Coins',
    listener: name => console.log('Bought', name)
  },
  {
    titles: [
      'Bucket of<br>Coins',
      'Buy From Store',
      'Gives You This Many Coins'
    ],
    icon: 'dollar',
    price: 4.99,
    text: '27.5k',
    type: 'purchase',
    name: 'Buy 27500 Coins',
    listener: name => console.log('Bought', name)
  },
  {
    titles: [
      'Barrel of Coins<br>(Best Value)',
      'Buy From Store',
      'Gives You This Many Coins'
    ],
    icon: 'dollar',
    price: 19.99,
    text: '120k',
    isBestValue: true,
    type: 'purchase',
    name: 'Buy 120000 Coins',
    listener: name => console.log('Bought', name)
  },
  {
    titles: [
      'Truck of<br>Coins',
      'Buy From Store',
      'Gives You This Many Coins'
    ],
    icon: 'dollar',
    price: 49.99,
    text: '320k',
    type: 'purchase',
    name: 'Buy 320000 Coins',
    listener: name => console.log('Bought', name)
  },
  {
    titles: [
      'Mountain of<br>Coins',
      'Buy From Store',
      'Gives You This Many Coins'
    ],
    icon: 'dollar',
    price: 99.99,
    text: '1.4m',
    type: 'purchase',
    name: 'Buy 1400000 Coins',
    listener: name => console.log('Bought', name)
  }
];
