import Inventory from '../inventory.js';

const { max } = Inventory;

export default Object.keys(max).reduce((acc, name) => {
  return acc.concat([[
    `Most<br>${name}s`,
    () => max[name]
  ]]);
}, []);
