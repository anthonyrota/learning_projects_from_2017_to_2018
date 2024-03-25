class Renderer {
  constructor () {
    this.width = $(window).width();
    this.height = $(window).height();
    
    this.canvas = PIXI.autoDetectRenderer(this.width, this.height);
    this.graphics = new PIXI.Graphics();
    this.stage = new PIXI.Container();
    this.stage.addChild(this.graphics);
    
    this.root = $(this.canvas.view);
    
    this.root.attr('id', 'game');
    
    $('.game').append(this.root);
    
    const self = this;
    $(window).resize(function() {
      self.width = $(window).width();
      self.height = $(window).height();
      
      self.canvas.resize(self.width, self.height);
    });
  }
  
  render (game) {
    const graphics = this.graphics;
    const snake = game.snake;
    const view = game.view;
    const camera = game.camera;
    
    const zoom = 1 / camera.zoom;
    
    graphics.clear();
    graphics.removeChildren();
    
    graphics.scale.set(zoom, zoom);
    
    graphics.beginFill(0, 0);
    graphics.lineStyle(view.w, 0xffffff);
    graphics.drawRect(view.minx, view.miny, view.maxx, view.maxy);
    graphics.endFill();
    
    for (let i = 0; i < snake.positions.length; i++) {
      const p = snake.positions[i];
      
      graphics.beginFill(p.c);
      graphics.lineStyle(0);
      graphics.drawCircle(p.x + camera.x, p.y + camera.y, snake.radius);
      graphics.endFill();
    }
    
    this.canvas.render(this.stage);
  }
}