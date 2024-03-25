import options from './options.js';

options.define('sound', 'toggle-sound', ($trigger, soundEnabled) => {
  if (soundEnabled) {
    $trigger.removeClass('fa-volume-off');
    $trigger.addClass('fa-volume-up');
  } else {
    $trigger.removeClass('fa-volume-up');
    $trigger.addClass('fa-volume-off');
  }
});

const storage = {};

export function loadSound(name, src) {
  storage[name] = new Audio(src);
}

export function playSound(name) {
  if (!options.enabled('sound')) {
    return;
  }
  
  const { src } = storage[name];
  const audio = new Audio(src);
  
  audio.play();
}
