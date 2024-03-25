import { format } from './helpers.js';
import Inventory from './inventory.js';
import ScoreTracker from './score.js';
import game from './game.js';

import bundledPurchases from './shop-items/index.js';

const $container = $('.shop-content');

class Shop {
  constructor(shopItems) {
    this.card = $('<div class="card-container">');
    this.items = {};
    
    shopItems.forEach(([ header, ...items ]) => {
      const $header = $(`<div class="card-header">${header}</div>`);
      this.card.append($header);
        
      items.forEach(({
        titles,
        icon,
        price,
        text,
        type,
        isBestValue,
        name,
        suffix = '',
        increment = 1,
        listener
      }) => {
        const $card = $(`<div class="card shadow-dark">`);
        const $ul = $(`<ul class="card-content flex-center">`);
        const $level = $(`<div class="gold-text">${text}</div>`);
        
        titles.forEach((title, i) => {
          const $li = $(`<li class="card-item flex-center">`);
          const content = $(`<div class="margin-bottom-small align-center">${title}</div>`);
          let inside;
          
          switch (i) {
            case 0:
              inside = $(`<i class="fa fa-${icon} icon-small gold-text"></i>`);
              $li.append(content);
              $li.append(inside);
              break;
            
            case 1:
              const buttonClass = type === 'purchase'
                ? isBestValue
                  ? 'red-button'
                  : 'green-button'
                : 'gold-button';
              
              inside = $(`<div class="${buttonClass} align-center">`);
              inside.append(content);
              
              const $cost = $(`<div class="align-center">\$${price}</div>`);
              inside.append($cost);
              
              $li.append(inside);
              this.bind(inside, $cost, $level, name, type, price, icon, suffix, increment, text, listener, header);
              break;
            
            case 2:
              $li.append(content);
              $li.append($level);
              break;
          }
          
          $ul.append($li);
        });
        
        $card.append($ul);
        this.card.append($card);
      });
    });
    
    $container.empty();
    $container.append(this.card);
  }
  
  notEnoughCoins(name) {
    swal('OOPS', `Not Enough Coins To Buy A ${name}`, 'error');
  }
  
  bind($trigger, $cost, $level, name, type, cost, icon, suffix, increment, text, listener, group) {
    let level = Number(text);
    let price = Number(store.get(name)) || cost;
    
    switch (type) {
      case 'item':
        Inventory.define(name, { icon, listener, group });
        break;
      
      case 'upgrade':
        $level.html(format(level, suffix));
        store.set(name, price);
        $cost.html(`\$${price}`);
        break;
      
      case 'purchase':
        $level.html(text + suffix);
        break;
    }
    
    $trigger.fastClick(() => {
      const coins = ScoreTracker.getCoins();
      
      switch (type) {
        case 'item':
          if (coins < cost) {
            this.notEnoughCoins(name);
            return;
          }
          ScoreTracker.removeCoins(cost);
          
          Inventory.add(name);
          break;
        
        case 'upgrade':
          if (coins < price) {
            this.notEnoughCoins(name);
            return;
          }
          ScoreTracker.removeCoins(price);
          
          price = Math.round(1.6 * price);
          store.set(name, price);
          level += increment;
          $level.html(format(level, suffix));
          listener(level);
          $cost.html(`\$${price}`);
          break;
        
        case 'purchase':
          listener(name);
          break;
      }
    });
  }
}

export default new Shop([ ...bundledPurchases ]);
