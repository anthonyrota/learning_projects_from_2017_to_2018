/**
 * A class that controls the canvas interactions with PIXI.js
 */
class GameCanvas {
  /**
   * Creates a new GameCanvas
   */
  constructor (element) {
    this.root = $(element);
    
    this.renderer = null;
    this.stage = null;
  }
  
  /**
   * Resets the Game Canvas and clears the PIXI.js stages
   */
  reset () {
    const width = this.root.width();
    const height = this.root.height();
    const options = {
      transparent: true
    };
    
    this.width = width;
    this.height = height;
    
    this.renderer = PIXI.autoDetectRenderer(width, height, options);
    this.root.append(this.renderer.view);
    
    this.graphics = new PIXI.Graphics();
    
    this.stage = new PIXI.Container();
  }
  
  /**
   * Renders the whole grid system
   *
   * @param {Array} positions The array of positions
   * @param {Number} r The radius of each snake part
   * @param {Array} grid The grid to render
   * @param {Number} size The size of each block
   * @param {Number} slen The length of the snake
   */
  render (positions, r, slen, grid, size) {
    this.renderer.clear();
    this.graphics.clear();
    this.stage.removeChildren();
    this.graphics.removeChildren();
    
    this.renderGrid(grid, size);
    this.renderSnake(positions, r, slen);
    
    this.stage.addChild(this.graphics);
    
    this.renderer.render(this.stage);
  }
  
  /**
   * Renders a snake
   * NOTE: Must be called after the renderGrid function
   *
   * @param {Array} positions The array of positions
   * @param {Number} r The radius of each snake part
   * @param {Number} slen The length of the snake
   */
  renderSnake (positions, r, slen) {
    const graphics = this.graphics;
    const head = positions[0];
    
    const slength = (slen + '').length;
    
    const text = new PIXI.Text(slen, {
      fontFamily: 'Function Regular',
      fontSize: 20,
      fill: 0xffffff
    });
    text.anchor.x = 0.46;
    text.position.set(head.x, head.y - 3.6 * r);
    
    for (let i = 0; i < positions.length; i++) {
      const part = positions[i];
      const { x, y, c } = part;
      
      graphics.beginFill(c);
      graphics.lineStyle(0);
      graphics.drawCircle(x, y, r);
      graphics.endFill();
    }
    
    graphics.addChild(text);
  }
  
  /**
   * Renders a game grid
   *
   * @param {Array} grid The grid to render
   * @param {Number} size The size of each block
   */
  renderGrid (grid, size) {
    this.renderer.clear();
    this.graphics.clear();
    this.stage.removeChildren();
    this.stage.addChild(this.graphics);
    
    const halfSize = size / 2;
    
    for (let i = 0; i < grid.length; i++) {
      const block = grid[i];
      const { x, y, rotation, color, id, scale, isCircle } = block;
      
      if (rotation || scale !== 1) {
        const graphics = new PIXI.Graphics();
        this.stage.addChild(graphics);
        
        graphics.position.set(x + halfSize, y + halfSize);
        graphics.pivot.set(halfSize, halfSize);
        graphics.scale.set(scale, scale);
        
        if (isCircle) {
          graphics.beginFill(0x262626);
          graphics.lineStyle(20, color);
          graphics.drawCircle(halfSize, halfSize, halfSize);
          graphics.endFill();
        } else {
          graphics.beginFill(color);
          graphics.rotation = rotation;
          graphics.drawRoundedRect(0, 0, size, size, 10);
          graphics.endFill();
        }
      } else {
        const graphics = this.graphics;
        
        if (isCircle) {
          graphics.beginFill(0x262626);
          graphics.lineStyle(20, color);
          graphics.drawCircle(x + halfSize, y + halfSize, halfSize);
          graphics.endFill();
        } else {
          graphics.beginFill(color);
          graphics.drawRoundedRect(x, y, size, size, 10);
          graphics.endFill();
        }
      }
    }
  }
}