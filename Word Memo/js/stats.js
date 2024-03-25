import { setupHardwipeDOM } from './hardwipe.js';
import applyStats from './stats/index.js';

const $container = $('.stats-content');

class StatsPage {
  constructor() {
    this.list = [];
    
    this.container = $('<div class="card-container">');
    $container.append(this.container);
  }
  
  define(name, func) {
    this.list.push([name, func]);
  }
  
  render() {
    $container.empty();
    
    for (let i = 0; i < this.list.length; i++) {
      const info = this.list[i];
      const [ name, func ] = info;
      
      const $card = $('<div class="card shadow-dark">');
      const $content = $('<ul class="card-content flex-center">');
      
      const $li1 = $('<li class="card-item flex-center align-center">');
      const $h1 = $(`<h1 class="margin-bottom-small">${name}</h1>`);
      
      const $li2 = $('<li class="card-item flex-center align-center">');
      const $value = $(`<h1 class="gold-text">`);
      
      info[2] = $value;
      
      $li1.append($h1);
      $li2.append($value);
      
      $content.append($li1);
      $content.append($li2);
      
      $card.append($content);
      $container.append($card);
    }
    
    setupHardwipeDOM($container);
  }
  
  update() {
    for (const [, func, $value ] of this.list) {
      $value.html(func());
    }
  }
}

export default applyStats(StatsPage);
