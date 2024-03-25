class Snake {
  constructor (viewLimit, nick) {
    this.positions = [];
    this.radius = 4;
    this.parts = 70;
    this.speed = 10;
    this.maxX = viewLimit.x;
    this.maxY = viewLimit.y;
    
    this.nick = nick;
    
    this.positions.push({
      x: -10000,
      y: -10000,
      c: 0xffff00
    });
    
    for (let i = 1; i < this.parts - 1; i++) {
      this.positions.push({
        x: $(window).width() / 2,
        y: $(window).height() / 2 + i * this.radius / 2,
        c: 0xffff00
      });
    }
  }
  
  moveTo (x, y) {
    const angle = Math.atan2(y, x);
    
    const diag = Math.min($(window).width(), $(window).height()) / 3;
    
    let len = Math.sqrt(x * x + y * y);
    
    if (len > diag) len = diag;
    
    const r = this.speed * len / diag;
    
    x = r * Math.cos(angle);
    y = r * Math.sin(angle);
    
    this.positions[0].x += x;
    this.positions[0].y += y;
    
    this.join();
  }
  
  constrainPart (index) {
    let part = this.positions[index];
    
    if (part.x + this.radius > this.maxX) {
      part.x = this.maxX - this.radius;
    }
    
    if (part.x - this.radius < -this.maxX) {
      part.x = -this.maxX + this.radius;
    }
    
    if (part.y + this.radius > this.maxY) {
      part.y = this.maxY - this.radius;
    }
    
    if (part.y - this.radius < -this.maxY) {
      part.y = -this.maxY + this.radius;
    }
  }
  
  join () {
    this.constrainPart(0);
    
    for (let i = 1; i < this.positions.length; i++) {
      const last = this.positions[i - 1];
      const curr = this.positions[i];
    
      const dx = curr.x - last.x;
      const dy = curr.y - last.y;
    
      const angle = Math.atan2(dy, dx);
    
      const nx = this.radius * Math.cos(angle) / 2;
      const ny = this.radius * Math.sin(angle) / 2;
    
      curr.x = nx + last.x;
      curr.y = ny + last.y;
      
      this.constrainPart(i);
    }
  }
  
  slither (x, y) {
    this.speed = this.radius;
    
    const head = this.positions[0];
    
    x = x - $(window).width() / 2;
    y = y - $(window).height() / 2;
    
    this.moveTo(x, y);
  }
}