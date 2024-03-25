const $timer = $('.timer');

function renderTime(count, danger) {
  $timer.html(count);
  
  if (danger) {
    $timer.addClass('danger-text');
  } else {
    $timer.removeClass('danger-text');
  }
}

export function countdown (time, dangerZone, cb) {
  let startTime = Math.floor(Date.now() / 1000);
  let lastTime;
  let id;
  let stopped = false;
  
  const update = () => {
    if (stopped) {
      return;
    }
    
    id = window.requestAnimationFrame(update);
    
    let currentTime = Math.floor(Date.now() / 1000);
    
    if (currentTime !== lastTime) {
      const count = time - (currentTime - startTime);
      
      if (count < 0) {
        cb();
        renderTime(0, true);
        window.cancelAnimationFrame(id);
      } else {
        renderTime(count, count <= dangerZone);
      }
    }
    
    lastTime = currentTime;
  };
  renderTime(time, time <= dangerZone);
  update();
  
  return {
    stop() {
      stopped = true;
      renderTime(0, true);
      window.cancelAnimationFrame(id);
    },
    
    getTime() {
      return time - (lastTime - startTime);
    }
  };
}
