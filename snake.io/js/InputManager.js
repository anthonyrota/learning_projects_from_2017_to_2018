class InputManager {
  constructor (game) {
    this.game = game;
    this.root = $(document);
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
    
    const x = touch.clientX;
    const y = touch.clientY;
    
    this.mouse = { x, y };
    
    this.constrainMouse();
  }
  
  constrainMouse () {
    const r = $(window);
    const w = r.width();
    const h = r.height();
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
      cb(e, self);
    };
    
    for (let i = 0; i < events.length; i++) {
      this.root.on(events[i], callback);
    }
  }
}