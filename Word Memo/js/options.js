class Options {
  constructor() {
    this.options = {};
  }
  
  define(name, trigger, cb, state = true) {
    this.options[name] = state;
    
    const $trigger = $('.' + trigger);
    
    $trigger.fastClick(() => {
      this.toggle(name);
      
      cb($trigger, this.enabled(name));
    });
  }
  
  toggle(name) {
    this.options[name] = !this.options[name];
  }
  
  enabled(name) {
    return !!this.options[name];
  }
}

export default new Options();
