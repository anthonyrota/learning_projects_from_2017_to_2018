export class Caret {
  constructor ({ lineIndex = 0, textIndex = 0, blinkRate = 1000 } = {}) {
    this.listeners = {};
    this.setPosition({ lineIndex, textIndex });
    this.opacity = 1;
    this.blinkTimer = 0;
    this.blinkRate = blinkRate;
    this.on('positionchange', () => {
      this.blinkTimer = blinkRate / 3;
    });
    window.requestAnimationFrame(this.updateBlink.bind(this));
  }
  
  updateBlink (time) {
    if (!this.lastBlinkTime) {
      this.lastBlinkTime = time;
    }
    
    this.blinkTimer += (time - this.lastBlinkTime);
    
    const oldOpacity = this.opacity;
    const timeInCycle = (this.blinkTimer % this.blinkRate) / this.blinkRate;
    const newOpacity = Math.max(Math.min((timeInCycle > 0.5 ? 1 - timeInCycle : timeInCycle) * 9 - 1.2, 1), 0);
    
    if (oldOpacity !== newOpacity) {
      this.opacity = newOpacity;
      this.fire('opacitychange');
    }
    
    this.lastBlinkTime = time;
    window.requestAnimationFrame(this.updateBlink.bind(this));
  }
  
  on (event, listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    
    this.listeners[event].push(listener);
  }
  
  off (event, listener) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        callback => callback !== listener
      );
    }
  }
  
  fire (event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => listener(data));
    }
  }
  
  resetVerticalMovement () {
    this.startVerticalMovementTextIndex = this.textIndex;
  }
  
  setPosition ({ lineIndex, textIndex }) {
    if (this.lineIndex !== lineIndex || this.textIndex !== textIndex) {
      this.lineIndex = lineIndex;
      this.textIndex = textIndex;
      this.fire('positionchange');
      this.resetVerticalMovement();
    }
  }
  
  moveUp (state) {
    if (this.lineIndex === 0 && this.textIndex === 0) {
      return;
    }
    
    if (this.lineIndex === 0) {
      this.textIndex = 0;
    } else {
      this.lineIndex -= 1;
      this.textIndex = Math.min(this.startVerticalMovementTextIndex, state.lines[this.lineIndex].length);
    }
    
    this.fire('positionchange');
  }
  
  moveDown (state) {
    if (this.lineIndex === state.lines.length - 1 && this.textIndex === state.lines[this.lineIndex].length) {
      return;
    }
    
    if (this.lineIndex === state.lines.length - 1) {
      this.textIndex = state.lines[this.lineIndex].length;
    } else {
      this.lineIndex += 1;
      this.textIndex = Math.min(this.startVerticalMovementTextIndex, state.lines[this.lineIndex].length);
    }
    
    this.fire('positionchange');
  }
  
  moveLeft (state) {
    if (this.textIndex === 0 && this.lineIndex === 0) {
      return;
    }
    
    if (this.textIndex === 0) {
      this.textIndex = state.lines[this.lineIndex - 1].length;
      this.lineIndex -= 1;
    } else {
      this.textIndex -= 1;
    }
    
    this.fire('positionchange');
    this.resetVerticalMovement();
  }
  
  moveRight (state) {
    if (this.lineIndex === state.lines.length - 1 && this.textIndex === state.lines[this.lineIndex].length) {
      return;
    }
    
    if (this.textIndex === state.lines[this.lineIndex].length) {
      this.textIndex = 0;
      this.lineIndex += 1;
    } else {
      this.textIndex += 1;
    }
    
    this.fire('positionchange');
    this.resetVerticalMovement();
  }
}
