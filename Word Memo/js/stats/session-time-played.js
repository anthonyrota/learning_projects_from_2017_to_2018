let startTime = Date.now();

export default [
  'Time Played<br>(Session)',
  () => {
    const dt = Date.now() - startTime;
    const min = Math.floor(dt / 60000);
    
    return `${min}min`;
  }
];
