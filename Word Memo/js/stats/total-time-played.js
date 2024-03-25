import { storeDefault } from '../helpers.js';

storeDefault('Time Played', 0);

let lastTime = Date.now();

const update = () => {
  const timePlayed = store.get('Time Played');
  const dt = Date.now() - lastTime;
  
  store.set('Time Played', timePlayed + dt);
  
  lastTime = Date.now();
  setTimeout(update, 1000);
};
update();

export default [
  'Time Played<br>(All Time)',
  () => {
    const timePlayed = store.get('Time Played');
    const min = Math.floor(timePlayed / 60000);
    
    return `${min}min`;
  }
];
