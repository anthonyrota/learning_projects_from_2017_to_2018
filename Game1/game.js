canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var animbackground;
var tempchar = new character(0,0,0,0,0,0,0,0,0,0,0,0,images.characters[0]);
tempchar.init(240,600,60,85);

function drawbackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (background.running) {
    background.update(0);
  }
  if (tiles.running) {
    tiles.update();
  }
  tempchar.update();
  if (background.running) {
    background.update(1);
  }
  keys.check();
  animbackground = window.requestAnimationFrame(drawbackground);
}

function init() {
  game.changestate(1);
}

var GAME_LOADING = 0, GAME_STARTSCREEN = 1, GAME_LOAD = 2, GAME_RUNNING = 3, GAME_FINISHED = 4;

var game = {
  state: 0,
  
  changestate: function(state) {
    if (this.state !== state || state === 0 || this.state === 0) {
      this.state = state;
      this.updatestate();
    }
  },
  
  updatestate: function() {
    tiles.end();
    background.end();
    loadinggameloader.style.visibility = "hidden";
    loader.style.visibility = "hidden";
    startscreenbuttons.style.visibility = "hidden";
    startscreentext.style.visibility = "hidden";
    switch (this.state) {
      case GAME_LOADING:
        loader.style.visibility = "visible";
        break;
      case GAME_STARTSCREEN:
        startscreenbuttons.style.visibility = "visible";
        startscreentext.style.visibility = "visible";
        background.init(1);
        break;
      case GAME_LOAD:
        setTimeout(function(){
          gamestripes.init();
        }, 100);
        break;
      case GAME_RUNNING:
        background.init(Math.floor(Math.random()*images.backgrounds.length));
        tiles.init(9.5,0);
        
        break;
      case GAME_FINISHED:
        
        break;
      default:
        this.changestate(1);
        break;
    }
  }
};

game.changestate(GAME_LOADING);