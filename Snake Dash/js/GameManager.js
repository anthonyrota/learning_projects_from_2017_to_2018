/**
 * Class that Controls the Game Logic
 */
class GameManager {
  /**
   * Creates a new GameManager
   */
  constructor () {
    this.stateManager = new StateManager(this);
    this.inputManager = new InputManager(this, '.game-screen');
    
    this.gameIsRunning = false;
    
    const self = this;
    this.stateManager.bindAction('PLAYING', function(stateManager) {
      window.setTimeout(() => {
        self.reset();
        self.gameTimer.reset();
    
        self.gameIsRunning = true;
        
        self.initLoop();
      }, 100);
    });
  }
  
  /**
   * Resets the game
   */
  reset () {
    this.HTMLManager = new HTMLManager();
    this.gameTimer = new GameTimer();
    this.gameCanvas = new GameCanvas('.game-screen');
    this.gameCanvas.reset();
    
    this.gameGrid = new GameGrid(5, this.gameCanvas);
    this.gameSnake = new GameSnake(this.gameCanvas);
    
    this.highscore = 0;
    this.frame = 0;
    
    this.gameIsRunning = false;
  }
  
  /**
   * Initializes the game loop
   */
  initLoop () {
    window.requestAnimationFrame(this.initLoop.bind(this));
    this.loop();
  }
  
  /**
   * Does all of the game logic
   */
  loop () {
    this.frame++;
    
    const dt = this.gameTimer.getNormalizedDifferenceInTime();
    const deltaTime = this.gameTimer.getTotalDifferenceInTime();
    
    this.gameGrid.moveDown(dt, deltaTime / 1000);
    this.gameGrid.generateRow();
    
    let snakeMoving = false;
    
    if (this.inputManager.mouse) {
      const { x, y } = this.inputManager.mouse;
      
      const sx = this.gameSnake.getHead().x;
      
      let strength = 0;
      if (Math.abs(sx - x) > 2) {
        const easing = (sx - x) * 0.8;
        
        this.gameSnake.moveTo(x + easing);
        
        const w = this.gameCanvas.width;
        
        if (sx - x > w / 2) {
          strength = 0.02;
        } else if (sx - x > w / 4) {
          strength = 0.04;
        } else if (sx - x > w / 8) {
          strength = 0.06;
        } else if (sx - x > w / 16) {
          strength = 0.13;
        } else {
          strength = 0.17;
        }
      } else {
        strength = 0.2;
      }
      
      this.gameSnake.straighten(strength * dt);
    }
    
    this.gameSnake.update(dt);
    
    // CollisionManager.solve(this.gameSnake, this.gameGrid);
    
    const grid = this.gameGrid.convertGridToArray();
    const snake = this.gameSnake.getRenderablePositions();
    
    this.gameCanvas.render(snake, this.gameSnake.snakeRadius, this.gameSnake.getLength(), grid, this.gameGrid.tileSize);
    
    this.gameTimer.updateGameTimer();
    
    const score = this.gameSnake.positions.length;
    $('.header .score').html(score);
    
    if (score > this.highscore) {
      this.highscore = score;
      $('.header .highscore div').html(score);
    }
    
    
    
    
    
    
    
    
    if(this.frame%4===0)$('#fps').html('FPS: '+Math.round(1000/(Date.now()-window.lastTime)));window.lastTime=Date.now();
  }
}