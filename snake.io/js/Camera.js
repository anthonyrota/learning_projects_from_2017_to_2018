class Camera {
  constructor () {
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
  }
  
  update (snake) {
    this.zoom = snake.radius / 12;
    
    const head = snake.positions[0];
    
    const dx = head.x - $(window).width() * this.zoom / 2;
    const dy = head.y - $(window).height() * this.zoom / 2;
    
    this.x = -dx;
    this.y = -dy;
  }
}
