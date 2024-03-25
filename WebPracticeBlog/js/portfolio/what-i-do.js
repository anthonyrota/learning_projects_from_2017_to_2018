const $container = $('.what-i-do');
const $text = $('.current-topic');
const $cursor = $('.cursor');

const points = [
  'progressive web apps.',
  'user interfaces.',
  'landing pages.',
  'mobile applications.',
  'desktop games.',
  'mobile games.',
  'professional websites.',
  'graphic intensive games.'
];

const timings = {
  idle: 2000,
  typing: 60,
  highlighting: 120
};

const states = {
  idle: 0,
  typing: 1,
  justhighlighting: 2,
  alreadyhighlighted: 3
};

let lasttime;
let state;
let chosenword;
let wordstringlength;
let wordpointer = 1;

const setstate = (newstate) => {
  lasttime = performance.now();
  state = states[newstate];
};

const setcursor = className => {
  $cursor.attr('class', `cursor ${className}`);
};

const setcontainer = className => {
  $container.attr('class', `title what-i-do ${className}`);
};

const settext = text => {
  $text.text(text);
};

const nextword = () => {
  return points[wordpointer++ % points.length];
};

const next = timing => {
  window.setTimeout(loop, timings[timing]);
};

const loop = () => {
  switch (state) {
    case states.idle:
      
      next('idle');
      setstate('justhighlighting');
      setcursor('idle');
      
      break;
    
    case states.typing:
      if (wordstringlength > chosenword.length) {
        setstate('idle');
      }
      
      next('typing');
      settext(chosenword.substr(0, wordstringlength++));
      setcursor('');
      
      break;
    
    case states.justhighlighting:
      chosenword = nextword();
      wordstringlength = 1;
      
      next('highlighting');
      setstate('alreadyhighlighted');
      setcontainer('highlighted');
      setcursor('disabled');
      
      break;
    
    case states.alreadyhighlighted:
      next('highlighting');
      settext('');
      setstate('typing');
      setcontainer('');
      setcursor('typing');
      
      break;
  }
};

setstate('idle');
loop();
