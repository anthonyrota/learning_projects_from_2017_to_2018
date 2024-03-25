var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var loader = document.getElementsByClassName("container")[0];
var progress = document.getElementById("container-progress-bar");
var percent = document.getElementById("container-percentage");
var stripes = document.getElementById("container-progress-stripes");

var loadinggameloader = document.getElementsByClassName("loading-game")[0];
var loadinggameprogress = document.getElementById("loading-game-progress-bar");
var loadinggamepercent = document.getElementById("loading-game-percentage");
var loadinggamestripes = document.getElementById("loading-game-progress-stripes");

var overlay = {
  current: null
};

var startscreenbuttons = document.getElementsByClassName("start-screen-buttons")[0];
//buttons
document.getElementById("start-game").onclick = function() {
  game.changestate(3);
  console.log("start");
};
document.getElementById("credits").onclick = function() {
  console.log("credits");
};
document.getElementById("about").onclick = function() {
  console.log("about");
};
document.getElementById("shop").onclick = function() {
  console.log("shop");
};
document.getElementById("options").onclick = function() {
  console.log("options");
};
document.getElementById("scores").onclick = function() {
  console.log("scores");
};

var startscreentext = document.getElementsByClassName("start-screen-text")[0];
//text
var startscreenheader = document.getElementById("start-screen-header");

var togglesound = document.getElementById("togglesound");
//togglesoundimage
var soundtoggleimage = document.getElementById("soundtoggle");
soundtoggleimage.src = images.icons[0][0].src;
togglesound.onclick = function() {
  if (!options.soundon) {
    soundtoggleimage.src = images.icons[0][0].src;
    options.soundon = true;
  } else {
    soundtoggleimage.src = images.icons[0][1].src;
    options.soundon = false;
  }
};