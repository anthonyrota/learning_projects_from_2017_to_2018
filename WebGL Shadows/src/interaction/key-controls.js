import { Keys } from './keys.js';

export class KeyControls {
  constructor(context) {
    this.bindings = {};
    this.pressed = {};
    this.context = context || this;
  }
  
  listen(key, callback) {
    if (!this.bindings[key]) {
      this.bindings[key] = [];
    }
    
    this.bindings[key].push(callback.bind(this.context));
  }
  
  isPressedFromKeycode(keycode) {
    return str.split(' ').some(key => this.pressed[key.toUpperCase()]);
  }
  
  isPressed(str) {
    return str.split(' ').some(key => this.pressed[Keys[key.toUpperCase()]]);
  }
  
  keydown(e) {
    this.pressed[e.keyCode] = true;
    
    if (this.bindings[e.keyCode]) {
      for (const callback of this.bindings[e.keyCode]) {
        callback(e);
      }
    }
  }
  
  keyup(e) {
    delete this.pressed[e.keyCode];
  }
}
