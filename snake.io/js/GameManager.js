class GameManager {
  constructor () {
    this.HTMLManager = new HTMLManager(this);
    this.renderer = new Renderer();
    this.inputs = new InputManager(this);
    this.snake = null;
    this.camera = null;
    this.frame = null;
    this.nick = null;
  }
  
  init (nickname) {
    this.camera = new Camera();
    this.view = new ViewLimit(10000, 10);
    this.snake = new Snake(this.view, nickname);
    this.view.update(this.camera);
    this.renderer.render(this);
    
    this.frame = 0;
    
    window.requestAnimationFrame(this.loop.bind(this));
  }
  
  loop () {
    this.snake.radius += 0.1;
    
    window.requestAnimationFrame(this.loop.bind(this));
    
    const { mouse: m } = this.inputs;
    
    this.snake.slither(m.x, m.y);
    this.camera.update(this.snake);
    this.view.update(this.camera);
    
    this.renderer.render(this);
    
    this.frame++;
    
    $('.coords').html(Math.floor(1000/(Date.now()-window.lastTime)));window.lastTime=Date.now();
  }
}