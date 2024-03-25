class ComponentFactory {
  constructor() {
    this.components = {};
    this.listeners = [];
    this.necessary = [];
    this.prefix = '.site-component--';
  }
  
  register(selector, component) {
    this.components[selector] = component;
  }
  
  manditory(where, component) {
    this.necessary.push({ where, component });
  }
  
  finished(func) {
    this.listeners.push(func);
  }
  
  resolve() {
    for (const [ selector, component ] of Object.entries(this.components)) {
      $(this.prefix + selector).replaceWith(component);
    }
    
    const $body = $('body');
    
    for (const { component, where } of this.necessary) {
      $body[where](component);
    }
    
    for (const callback of this.listeners) {
      callback(this);
    }
  }
}

export const Factory = new ComponentFactory();
