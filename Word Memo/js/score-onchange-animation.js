import { shortenNumber } from './helpers.js';

const duration = 600;
const $body = $('body');

export default function applyOnChangeAnimation(query, defaultValue) {
  const $query = $(query);
  
  let queries = [];
  $query.each((i, block) => { queries.push($(block)) });
  
  let lastValue = defaultValue;
  
  return number => {
    if (!number) {
      return;
    }
    
    const diff = number - lastValue;
    
    lastValue = number;
    
    if (!diff) {
      return;
    }
    
    const $popup = $('<h1 class="fade-up-out">');
    
    const { left, top } = queries.reduce((acc, $block) => {
      const offset = $block.offset();
      return {
        left: Math.max(offset.left, acc.left),
        top: Math.max(offset.top, acc.top)
      };
    }, { left: 0, top: 0 });
    
    const width = queries.reduce((acc, $block) => Math.max(acc, $block.width()), 0);
    
    const html = (diff > 0 ? '+' : '') + Math.round(diff);
    const className = diff > 0 ? 'green-text' : 'danger-text';
    
    $body.append($popup);
    
    $popup.html(shortenNumber(html));
    $popup.addClass(className);
    
    window.setTimeout(() => {
      $popup.remove();
    }, duration);
    
    window.setTimeout(() => {
      $popup.css('top', top);
      $popup.css('left', left + (width - $popup.width()) / 2);
    
      $popup.addClass('active');
    }, 0);
  };
}
