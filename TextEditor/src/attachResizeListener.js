const listeners = [];

export function attachResizeListener (listener) {
  listeners.push(listener);
}

export function detatchResizeListener (listener) {
  for (let i = 0; i < listeners.length; i++) {
    if (listeners[i] === listener) {
      listeners.splice(i--, 1);
    }
  }
}

let lastWidth = window.innerWidth;
let lastHeight = window.innerHeight;

function checkIfResized () {
  if (lastWidth !== window.innerWidth || lastHeight !== window.innerHeight) {
    listeners.forEach(listener => {
      listener();
    });
    
    lastWidth = window.innerWidth;
    lastHeight = window.innerHeight;
  }
}

setInterval(checkIfResized, 800);
