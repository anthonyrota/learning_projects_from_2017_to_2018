import applyWordList from './categories/index.js';
import ScoreTracker from './score.js';
import game from './game.js';

const $container = $('.inventory-container');

class Inventory {
  constructor() {
    this.items = store.get('inventory') || {};
    this.max = store.get('inventory') || {};
    this.chosen = {};
    this.html = {};
  }
  
  isEmpty() {
    for (const data of Object.values(this.html)) {
      if (data.isToggle) {
        return false;
      }
    }
    for (let name in this.items) {
      if (this.has(name)) {
        return false;
      }
    }
    return true;
  }
  
  define(itemName, html) {
    if (!this.items[itemName]) {
      this.items[itemName] = 0;
      this.max[itemName] = 0;
      this.save();
    }
    this.html[itemName] = html;
  }
  
  defineWordCategory(name, words) {
    this.html[name] = {
      isToggle: true,
      group: 'Categories<br>Pick 1 or more',
      icon: 'tags',
      wordCount: words.length,
      listener() {
        game.addWords(words);
      }
    };
  }
  
  add(itemName) {
    this.items[itemName]++;
    
    if (this.items[itemName] > this.max[itemName]) {
      this.max[itemName] = this.items[itemName];
    }
    
    this.save();
  }
  
  get(itemName) {
    return this.items[itemName];
  }
  
  has(itemName) {
    return this.items[itemName] > 0;
  }
  
  remove(itemName) {
    this.items[itemName]--;
    this.save();
  }
  
  save() {
    store.set('inventory', this.items);
    store.set('inventory-max', this.max);
  }
  
  renderItem($trigger, $title, $icon, name) {
    if (this.chosen[name]) {
      $trigger.removeClass('red-button');
      $trigger.addClass('green-button');
      $title.html('Undo');
      $icon.removeClass('fa-times');
      $icon.addClass('fa-check');
    } else {
      $trigger.removeClass('green-button');
      $trigger.addClass('red-button');
      $title.html('Choose');
      $icon.removeClass('fa-check');
      $icon.addClass('fa-times');
    }
  }
  
  render() {
    $container.empty();
    
    const { html } = this;
    
    this.chosen = {};
    this.groups = {};
    
    let keys = [];
    
    let htmlKeys = Object.keys(html);
    
    for (const key of htmlKeys) if (!html[key].isToggle) keys.push(key);
    for (const key of htmlKeys) if (html[key].isToggle) keys.push(key);
    
    for (const name of keys) {
      if (!this.has(name) && !html[name].isToggle) {
        continue;
      }
      
      const amount = this.get(name);
      const {
        icon,
        listener,
        group,
        wordCount,
        isToggle
      } = html[name];
      
      const $card = $('<div class="card shadow-dark">');
      const $ul = $('<ul class="card-content flex-center">');
      
      const $li1 = $(`
        <li class="card-item flex-center align-center">
          <div class="margin-bottom-small">${name}</div>
          <i class="fa fa-${icon} icon-small gold-text"></i>
        </li>
      `);
      
      const $li2 = $(`
        <li class="card-item flex-center">
          <div class="margin-bottom-small">${wordCount ? 'Words' : 'Amount'}</div>
          <div class="align-center">${wordCount || amount}</div>
        </li>
      `);
      
      const $li3 = $('<li class="card-item flex-center">');
      const $trigger = $('<div class="red-button align-center">');
      const $title = $('<div class="margin-bottom-small uppercase bold">Choose</div>');
      const $icon = $('<i class="fa fa-times icon-small">');
      
      const toggle = () => {
        if (isToggle) {
          this.chosen[name] = !this.chosen[name];
          this.renderItem($trigger, $title, $icon, name);
          return;
        }
        
        if (this.chosen[name]) {
          this.chosen[name] = false;
          this.renderItem($trigger, $title, $icon, name);
          return;
        }
        
        for (const { $trigger, $title, $icon, name } of this.groups[group]) {
          this.chosen[name] = false;
          this.renderItem($trigger, $title, $icon, name);
        }
        
        this.chosen[name] = !this.chosen[name];
        this.renderItem($trigger, $title, $icon, name);
      };
      
      $trigger.fastClick(toggle);
      
      const groupData = {
        $trigger,
        $title,
        $icon,
        name
      };
      
      if (!this.groups[group]) {
        const $header = $(`<div class="card-header">${group}</div>`);
        $container.append($header);
        
        this.groups[group] = [groupData];
      } else {
        this.groups[group].push(groupData);
      }
      
      $trigger.append($title);
      $trigger.append($icon);
      $li3.append($trigger);
      
      $ul.append($li1);
      
      $ul.append($li2);
      
      $ul.append($li3);
      
      $card.append($ul);
      $container.append($card);
    }
  }
  
  apply() {
    const { chosen, html } = this;
    
    for (const name of Object.keys(chosen)) {
      if (!chosen[name]) {
        continue;
      }
      
      if (html[name].isToggle) {
        html[name].listener();
        return;
      }
      
      this.remove(name);
      html[name].listener();
    }
  }
}

const inventory = new Inventory();
applyWordList(inventory);

export default inventory;
