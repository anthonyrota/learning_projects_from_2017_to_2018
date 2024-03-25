/**
 * The data id of each grid tile
 */
window.GRID_TILE_IDS = {
  EMPTY_BLOCK: 0,
  ROUND_BLOCK: 1,
  COIN: 2,
  FOOD: 3
};

/**
 * The possible neon colors for each tile
 */
window.GRID_TILE_COLORS = ["#CB3301", "#FF0066", "#FF6666", "#FEFF99", "#FFFF67", "#CCFF66", "#99FE00", "#EC8EED", "#FF99CB", "#FE349A", "#CC99FE", "#6599FF", "#03CDFF", "#FFFFFF"];

(function() {
  function hexadecimal (hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return 255 * 255 * r + 255 * g + b;
  }
  
  let colors = window.GRID_TILE_COLORS;
  
  for (let i = 0; i < colors.length; i++) {
    colors[i] = hexadecimal(colors[i]);
  }
})();

/**
 * Controls the game's grid system
 */
class GameGrid {
  /**
   * Generates a random tile color
   */
  static getRandomTileColor () {
    const colors = window.GRID_TILE_COLORS;
    const len = colors.length;
    const index = Math.floor(Math.random() * len);
    
    return colors[index];
  }
  
  /**
   * Generates a random tile's data
   */
  static getRandomTile () {
    const ids = window.GRID_TILE_IDS;
    
    let id = Math.random() > 0.2
             ? 'ROUND_BLOCK'
             : Math.random() > 0.95
               ? 'COIN'
               : 'FOOD';
    
    return {
      id: ids[id],
      color: GameGrid.getRandomTileColor()
    };
  }
  
  /**
   * Creates a new Game Grid
   *
   * @param {Number} width The number of columns in each grid row
   * @param {GameCanvas} gameCanvas The parent gameCanvas
   */
  constructor (width, gameCanvas) {
    this.grid = [];
    this.width = width;
    this.gameCanvas = gameCanvas;
    this.gap = 3;
    this.tileSize = this.gameCanvas.width / this.width - this.gap;
    this.tileSpeed = 0.07;
    
    this.y = 0;
  }
  
  /**
   * Generates a random row
   */
  generateRow () {
    const size = this.tileSize + this.gap;
    const gap = this.gap;
    
    const highest = this.getHighestPosition().y;
    if (highest && highest < -size) return;
    
    let y = highest - size;
    
    while (y > 0) {
      y -= size;
    }
    
    while (Math.random() > 0.8) {
      y -= size;
    }
    
    let row = [];
    
    for (let i = 0; i < this.width; i++) {
      if (Math.random() > 0.9) {
        const data = GameGrid.getRandomTile();
        
        let scale = 1;
        let isCircle = false;
        
        if (data.id === window.GRID_TILE_IDS.COIN) {
          scale = 0.15;
          data.color = 0xffff00;
          isCircle = true;
        }
        
        if (data.id === window.GRID_TILE_IDS.FOOD) {
          scale = 0.18;
          data.color = 0xff00ff;
        }
        
        row.push({
          x: i * size + gap / 2,
          y: y,
          rotation: 0,
          size: size - gap,
          oSize: size - gap,
          color: data.color,
          id: data.id,
          scale: scale,
          isCircle
        });
      }
    }
    
    this.grid.push(row);
    
    this.tileSpeed += 0.0001;
    this.constrainTileSpeed();
  }
  
  /**
   * Constrains the tile speed
   */
  constrainTileSpeed () {
    if (this.tileSpeed > 0.06) {
      this.tileSpeed = 0.06;
    }
  }
  
  /**
   * Moves the grid down by a certain number
   *
   * @param {Number} dy The amount to move down by
   */
  moveDown (dt, timePassed) {
    const size = this.tileSize;
    const dy = size * dt * this.tileSpeed;
    const ids = window.GRID_TILE_IDS;
    const sin = (Math.sin(timePassed) + 7) * 0.02;
    
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        const tile = this.grid[i][j];
        
        tile.y += dy;
        
        if (tile.id === ids.COIN) {
          tile.scale = sin;
        }
        
        if (tile.id === ids.FOOD) {
          tile.rotation += 0.03;
        }
      }
    }
    
    this.trimGrid();
  }
  
  /**
   * Converts the grid to an array
   */
  convertGridToArray () {
    const array = [];
    
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        array.push(this.grid[i][j]);
      }
    }
    
    return array;
  }
  
  /**
   * Converts the grid to an array ready for collision checking
   */
  convertToCollisionReadyArray () {
    const array = [];
    const ids = window.GRID_TILE_IDS;
    
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        const block = this.grid[i][j];
        
        if (block.id !== ids.ROUND_BLOCK) {
          continue;
        }
        
        array.push({
          min: {
            x: block.x,
            y: block.y
          },
          max: {
            x: block.x + block.size,
            y: block.y + block.size
          }
        });
      }
    }
    
    return array;
  }
  
  /**
   * Removes any unnecessary grid tiles that are off the screen
   */
  trimGrid () {
    const size = this.tileSize + this.gap;
    const maxY = this.gameCanvas.height + 2 * size;
    
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        const tile = this.grid[i][j];
        
        if (tile.y > maxY) {
          this.grid.splice(i, 1);
          i--;
          break;
        }
      }
    }
  }
  
  /**
   * Gets the first position of the highest block
   */
  getHighestPosition () {
    let highest = { x: 0, y: Infinity };
    
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        const position = this.grid[i][j];
        
        if (position.y < highest.y) {
          highest = position;
        }
      }
    }
    
    if (highest.y === Infinity) {
      highest.y = 0;
    }
    
    return highest;
  }
}