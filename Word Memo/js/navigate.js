const select = x => $(`.${x}`);
const fadeDuration = 0;

let targets = [];

export function navigateToTarget($target, cb) {
  return () => {
    for (const $other of targets) {
      $other.fadeOut(fadeDuration);
    }
    
    window.setTimeout(() => {
      if (cb) {
        const $page = cb();
        if ($page) {
          navigateToTarget($page)();
          return;
        }
      }
      $target.fadeIn();
    }, fadeDuration);
  };
}

export function defineTarget($target) {
  targets.push($target);
}

export function setupNavigation(events) {
  for (let selector in events) {
    const { cb, target } = events[selector];
    
    const $button = select(selector);
    const $target = select(target);
    
    defineTarget($target);
    
    $button.fastClick(navigateToTarget($target, cb));
  }
}
