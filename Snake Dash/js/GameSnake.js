/**
 * A class that controls the game snake
 */
class GameSnake {
  /**
   * Creates a new game snake
   */
  constructor (gameCanvas) {
    this.snakeRadius = gameCanvas.width / 50;
    this.gameCanvas = gameCanvas;
    this.positions = [];
    
    this.positions.push({
      x: gameCanvas.width / 2,
      y: gameCanvas.height - this.snakeRadius,
      c: 0xffff00
    });
    
    const len = 50;
    for (let i = 0; i < len; i++) {
      this.addPart();
    }
    
    this.maxY = gameCanvas.height * 0.65;
    
    this.frozen = false;
  }
  
  /**
   * Gets the positions of the snake
   */
  getPositions () {
    return this.positions;
  }
  
  /**
   * Adds a part to the snake
   */
  addPart () {
    const tail = this.getTail();
    const y = tail.y + this.snakeRadius * 2;
    
    this.positions.push({
      x: tail.x,
      y: y,
      c: 0xffff00
    });
  }
  
  getHead () {
    return this.positions[0];
  }
  
  getTail () {
    return this.positions[this.positions.length - 1];
  }
  
  getLength () {
    return this.positions.length;
  }
  
  moveTo (x) {
    const min = this.snakeRadius;
    const max = this.gameCanvas.width - this.snakeRadius;
    
    if (x < min) x = min;
    if (x > max) x = max;
    
    this.getHead().x = x;
  }
  
  straighten (strength = 0.09) {
    if (this.frozen) {
      return;
    }
    
    const r = 2 * this.snakeRadius;
    
    const perpAngle = Math.PI / 2;
    
    for (let i = 1; i < this.positions.length; i++) {
      const last = this.positions[i - 1];
      const curr = this.positions[i];
      
      // if (Math.abs(curr.x - last.x) < 0.1) {
      //   continue;
      // }
      
      // curr.x = curr.x + (last.x - curr.x) / 2;
      
      const dx = curr.x - last.x;
      const dy = curr.y - last.y;
      
      let angle = Math.atan2(dy, dx);
      angle += (perpAngle - angle) * strength;
      
      const nx = r * Math.cos(angle);
      const ny = r * Math.sin(angle);
      
      curr.x = nx + last.x;
      curr.y = ny + last.y;
      
      // return;
      
      if (curr.y > this.gameCanvas.height * 5) {
        return;
      }
    }
  }
  
  /**
   * Updates the GameSnake
   *
   * @param {Number} dt The average normalized fps
   */
  update (dt) {
    const head = this.getHead();
    
    if (!(head.y < this.maxY)) {
      for (let i = 0; i < this.positions.length; i++) {
        this.positions[i].y -= 5 * dt;
      }
    }
  }
  
  moveDown (dy) {
    for (let i = 0; i < this.positions.length; i++) {
      this.positions[i].y += dy;
    }
  }
  
  getRenderablePositions () {
    const array = [];
    
    for (let i = 0; i < this.positions.length; i++) {
      const part = this.positions[i];
      
      if (part.y - this.snakeRadius < this.gameCanvas.height) {
        array.push(part);
      }
    }
    
    return array;
  }
  
  convertPositionsIntoCollisionReadyArray () {
    const array = [];
    
    for (let i = 0; i < this.positions.length; i++) {
      const part = this.positions[i];
      
      if (part.y + this.snakeRadius < this.gameCanvas.height) {
        array.push({
          min: {
            x: part.x - this.snakeRadius,
            y: part.y - this.snakeRadius
          },
          max: {
            x: part.x + this.snakeRadius,
            y: part.y + this.snakeRadius
          },
          index: i
        });
      }
    }
    
    return array;
  }
}
