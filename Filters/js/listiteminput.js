class ListItemInput {
  constructor(binding, options) {
    this.li = $('<li>');
    
    this.binding = binding;
    this.options = options;
    
    if (options.isColor) {
      this.bindAsColor();
    } else {
      this.bindAsSlider();
    }
    
    this.li.append(this.span);
    this.li.append(this.count);
    this.li.append(this.input);
  }
  
  bindAsSlider() {
    const self = this;
    
    const {
      min,
      max,
      step,
      name
    } = this.options;
    
    const binding = this.binding;
    
    this.span = $('<span class="name">').html(name);
    this.count = $('<span class="count">').html(binding.value);
    
    this.input = $(`<input class="slider" type="range" step="${step}"
                           min="${min}" max="${max}" value="${binding.value}">`);
    
    this.input.on('change', function() {
      const value = self.input.val();
      
      self.count.html(value);
      self.binding.value = value;
    });
  }
  
  bindAsColor() {
    const self = this;
    
    this.li.addClass('color-container');
    
    this.span = $('<span class="name">').html(this.options.name);
    this.count = $('<span class="count">');
    
    this.input = $('<input class="text-input type="text" value="#fff">');
    
    if (!this.binding.value) {
      this.binding.value = 0xFFFFFF;
      this.input.val(this.binding.value);
    }
    
    window.bindColorInput(this.input, function(color, decimal) {
      self.count.css('color', color);
      self.binding.value = decimal;
    });
  }
  
  getHtml() {
    return this.li;
  }
}
