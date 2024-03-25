class Card {
  static nextID() {
    return Card.ID++;
  }
  
  constructor(list) {
    if (!('bindToggles' in this)) {
      throw new Error('bindToggles method must be implemented');
    }
    
    if (!('getFilter' in this)) {
      throw new Error('getFilter method must be implemented');
    }
    
    const self = this;
    
    this.filters = list;
    
    this.container = $('ul.filters');
    
    this.listItem = $('<li>');
    this.closeButton = $('<span class="close">').html('&times;');
    
    this.closeButton.click(function() {
      self.listItem.remove();
      self.closeCallback();
    });
    
    this.bindDropdown(list);
    this.bindToggles(list[0]);
    
    this.listItem.append(this.closeButton);
    
    this.container.append(this.listItem);
  }
  
  // abstract bindToggles()
  
  // abstract getFilter()
  
  bindDropdown(list) {
    const self = this;
    const id = Card.nextID();
    
    const dropdown = $('<div class="dropdown">');
    
    const input = $(`<input type="checkbox" id="dropdown-input-${id}">`);
    const label = $(`<label for="dropdown-input-${id}">${list[0].name}</label>`);
    
    const optionsUL = $('<ul class="options"></ul>');
    
    for (let i = 0; i < list.length; i++) {
      const li = $('<li>').html(list[i].name);
      
      li.click(function() {
        self.bindToggles(list[i]);
        
        label.html(list[i].name);
        input.prop('checked', false);
      });
      
      optionsUL.append(li);
    }
    
    dropdown.append(input);
    dropdown.append(label);
    dropdown.append(optionsUL);
    
    this.listItem.children('.dropdown').remove();
    this.listItem.append(dropdown);
    
    this.id = id;
  }
  
  closeCallback() {
    throw new Error('A close callback must be specified');
  }
  
  onclose(cb) {
    this.closeCallback = cb;
  }
  
  getID() {
    return this.id;
  }
}

Card.ID = 100;