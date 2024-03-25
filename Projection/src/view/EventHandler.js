const noop = _ => _;

export default class EventHandler {
  constructor({ self = this, element, update, keyPressed, mouseMove, scrollZoom }) {
    this.pressed = {};
    
    this._keyPressed = (keyPressed || noop).bind(self);
    this._mouseMove = (mouseMove || noop).bind(self);
    this._update = (update || noop).bind(self);
    this._scrollZoom = (scrollZoom || noop).bind(self);
    
    this.attach(element);
  }
  
  attach(element) {
    element.addEventListener('mousedown', e => element.requestPointerLock());
    
    const keypressed = this.keypressed.bind(this);
    const keyreleased = this.keyreleased.bind(this);
    const mousemove = this.mousemove.bind(this);
    const scrollzoom = this.scrollzoom.bind(this);
    
    document.addEventListener('pointerlockchange', e => {
      if (document.pointerLockElement === element) {
        document.addEventListener('keydown', keypressed);
        document.addEventListener('keyup', keyreleased);
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mousewheel', scrollzoom);
        document.addEventListener('DOMMouseScroll', scrollzoom);
      } else {
        document.removeEventListener('keydown', keypressed);
        document.removeEventListener('keyup', keyreleased);
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mousewheel', scrollzoom);
        document.removeEventListener('DOMMouseScroll', scrollzoom);
      }
    });
  }
  
  keypressed(e) {
    this.pressed[e.keyCode] = true;
    this._keyPressed(e, true);
  }
  
  keyreleased(e) {
    this.pressed[e.keyCode] = false;
    this._keyPressed(e, false);
  }
  
  mousemove(e) {
    this._mouseMove(e, e.movementX, e.movementY);
  }
  
  scrollzoom(e) {
    const deltaX = e.wheelDeltaX;
    const deltaY = e.wheelDeltaY;
    
    this._scrollZoom(e, deltaX, deltaY);
  }
}
