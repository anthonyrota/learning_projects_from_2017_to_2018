(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var camera = {
  x: 0,
  y: 0,
  
  update: function(snake) {
    var head = snake.positions[0];
    
    var dx = head.x - canvas.width / 2;
    var dy = head.y - canvas.height / 2;
    
    this.x = -dx;
    this.y = -dy;
  }
};

var viewLimit = {
  x: 10000,
  y: 10000,
  
  render: function() {
    var w = 10;
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = w;
    
    var minx = camera.x - this.x - w / 2;
    var miny = camera.y - this.y - w / 2;
    
    var maxx = 2 * this.x + w;
    var maxy = 2 * this.y + w;
    
    ctx.strokeRect(minx, miny, maxx, maxy);
  }
};

var snake = {
  positions: [],
  radius: 7,
  parts: 60,
  color: '#ffff00',
  
  lastX: 0,
  lastY: 0,
  
  speed: 10,
  
  init: function() {
    this.positions.push({
      x: 2 * Math.random() * viewLimit.x - viewLimit.x,
      y: 2 * Math.random() * viewLimit.y - viewLimit.y
    });
    
    for (var i = 1; i < this.parts - 1; i++) {
      this.positions.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + i * this.radius / 2
      });
    }
  },
  
  render: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = this.color;
    ctx.lineWidth = 0;
    
    for (var i = 0; i < this.positions.length; i++) {
      ctx.beginPath();
      
      ctx.arc(
        this.positions[i].x + camera.x,
        this.positions[i].y + camera.y,
        this.radius,
        0, 2 * Math.PI
      );
      
      ctx.closePath();
      ctx.fill();
    }
  },
  
  moveTo: function(x, y) {
    var angle = Math.atan2(y, x);
    
    var diag = Math.min(canvas.width, canvas.height) / 3;
    var radius = diag / 4;
    
    var len = Math.sqrt(x * x + y * y);
    
    if (len > radius) len = radius;
    
    var r = this.speed * len / radius;
    
    x = r * Math.cos(angle);
    y = r * Math.sin(angle);
    
    this.positions[0].x += x;
    this.positions[0].y += y;
    
    this.join();
  },
  
  constrainPart: function(index) {
    var part = this.positions[index];
    
    if (part.x + this.radius > viewLimit.x) {
      part.x = viewLimit.x - this.radius;
    }
    
    if (part.x - this.radius < -viewLimit.x) {
      part.x = -viewLimit.x + this.radius;
    }
    
    if (part.y + this.radius > viewLimit.y) {
      part.y = viewLimit.y - this.radius;
    }
    
    if (part.y - this.radius < -viewLimit.y) {
      part.y = -viewLimit.y + this.radius;
    }
  },

  join: function() {
    this.constrainPart(0);
    
    for (var i = 1; i < this.positions.length; i++) {
      var last = this.positions[i - 1];
      var curr = this.positions[i];
    
      var dx = curr.x - last.x;
      var dy = curr.y - last.y;
    
      var angle = Math.atan2(dy, dx);
    
      var nx = this.radius * Math.cos(angle) / 2;
      var ny = this.radius * Math.sin(angle) / 2;
    
      curr.x = nx + last.x;
      curr.y = ny + last.y;
      
      this.constrainPart(i);
    }
  },
  
  slither: function(x, y) {
    var head = this.positions[0];
    
    this.lastX = head.x;
    this.lastY = head.y;
    
    this.moveTo(x - canvas.width / 2, y -  canvas.height / 2);
  }
};

snake.init();

var mouse = false;
window.addEventListener('mousemove', function(e) {
  mouse = {
    x: e.clientX,
    y: e.clientY
  };
});

window.requestAnimationFrame(function loop() {
  window.requestAnimationFrame(loop);
  
  if (mouse) {
    snake.slither(mouse.x, mouse.y);
    camera.update(snake);
  }
  
  snake.render();
  viewLimit.render();
  
  
  document.querySelector('span').innerHTML = 'x: ' + Math.round(snake.positions[0].x) + ', y: ' + Math.round(snake.positions[0].y);
});
