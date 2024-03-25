/**
 * A class that controls inputs
 */
class InputManager {
  /**
   * Creates a new Input Manager
   */
  constructor (gameManager, root) {
    this.gameManager = gameManager;
    this.root = $(root);
    this.touchdown = false;
    this.mouse = false;
    
    this.listen('touchstart mousedown', (e, self) => {
      self.touchdown = true;
      self.updateMouse(e);
    });
    
    this.listen('touchmove mousemove', (e, self) => {
      self.updateMouse(e);
    });
    
    this.listen('touchend mouseup', (e, self) => {
      self.touchdown = false;
    });
  }
  
  updateMouse (e) {
    const touch = e.touches ? e.touches[0] : e;
    const offset = this.root.offset();
    
    const x = touch.clientX - offset.left;
    const y = touch.clientY - offset.top;
    
    this.mouse = { x, y };
    
    this.constrainMouse();
  }
  
  constrainMouse () {
    const r = this.gameManager.gameCanvas.root;
    const w = r.width;
    const h = r.height;
    const m = this.mouse;
    
    if (m.x < 0) m.x = 0;
    if (m.y < 0) m.y = 0;
    if (m.x > w) m.x = w;
    if (m.y > h) m.y = h;
  }
  
  listen (types, cb) {
    const self = this;
    const events = types.split(' ');
    
    const callback = function (e) {
      if (self.gameManager.gameIsRunning) {
        cb(e, self);
      }
    };
    
    for (let i = 0; i < events.length; i++) {
      this.root.on(events[i], callback);
    }
  }
}