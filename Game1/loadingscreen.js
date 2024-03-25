var stripesmargin = 0;
var animatestripes;
var gameanimatestripes;

function animstripes() {
  stripesmargin -= 1;
  stripes.innerHTML = stripes.innerHTML + "/";
  stripes.style.marginLeft = stripesmargin + "px";
  animatestripes = window.requestAnimationFrame(animstripes);
}

var gamestripes = {
  
  margin: 0,
  fcount: 0,
  
  init: function() {
    loadinggameloader.style.visibility = "visible";
    this.margin = 0;
    this.fcount = 0;
    gameanimatestripes = window.requestAnimationFrame(this.anim);
  },
  
  anim: function() {
    gamestripes.margin -= 1;
    loadinggamestripes.innerHTML = loadinggamestripes.innerHTML + "/";
    loadinggamestripes.style.marginLeft = gamestripes.margin + "px";
    if (gamestripes.fcount < 100) {
      gamestripes.fcount += Math.random() > 0.6 ? 1 : 0;
      gamestripes.animate(gamestripes.fcount);
    }
    gameanimatestripes = window.requestAnimationFrame(gamestripes.anim);
  },
  
  animate: function(count) {
    loadinggameprogress.style.width = Math.floor(count) + "%";
    loadinggamepercent.innerHTML = Math.floor(count) + "%";
    if (count === 100) {
      document.getElementById("load-game-text").innerHTML = "Loaded!";
      setTimeout(function(){
        window.cancelAnimationFrame(gameanimatestripes);
        loadinggameloader.style.visibility = "hidden";
        game.changestate(3);
      }, 1000);
    }
  }
};

animatestripes = window.requestAnimationFrame(animstripes);