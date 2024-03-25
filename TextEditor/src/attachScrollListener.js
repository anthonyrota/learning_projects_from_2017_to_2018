const listeners = new Map();

function createScrollListener (callback) {
  let deltaX = 0;
  let deltaY = 0;
  let animationId;
  
  const animation = () => {
    animationId = window.requestAnimationFrame(animation);
    
    if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
      deltaX *= 0.66;
      deltaY *= 0.66;
      
      callback({ deltaX, deltaY });
    } else {
      deltaX = 0;
      deltaY = 0;
    }
  };
  
  animationId = window.requestAnimationFrame(animation);
  
  return {
    listener: e => {
      deltaX += e.deltaX * 0.7;
      deltaY += e.deltaY * 0.7;
    },
    detatch: () => window.cancelAnimationFrame(animationId)
  };
}

export function attachScrollListener (element, callback) {
  if (!listeners.has(callback)) {
    listeners.set(callback, createScrollListener(callback));
  }
  
  element.addEventListener('wheel', listeners.get(callback).listener);
}

export function detatchScrollListener (element, callback) {
  if (!listeners.has(callback)) {
    return;
  }
  
  const handler = listeners.get(callback);
  
  element.removeEventListener('wheel', handler.listener);
  handler.detatch();
  
  listeners.remove(callback);
}
