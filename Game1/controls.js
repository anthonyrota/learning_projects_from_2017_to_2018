window.addEventListener('resize', function(event){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (!background.resizing && background.running) {
    background.init(background.currentnum);
  }
  background.resizing = false;
  if (!tiles.resizing && tiles.running) {
    tiles.init(tiles.ts, tiles.num);
  }
  tiles.resizing = false;
});

keys = {
  all: [],
  cur: 0,
  i: 0,
  cnt: null,
  tlen: null,
  slen: null,
  
  add: function(keycodes, delay, callback) {
    if (callback && typeof(callback) === "function") {
      this.all.push([keycodes, 0, callback, delay]);
    }
  },
  
  check: function() {
    this.tlen = this.all.length;
    for (this.cur = 0; this.cur < this.tlen; this.cur++) {
      this.cnt = true;
      this.slen = this.all[this.cur][0].length;
      for (this.i = 0; this.i < this.slen; this.i++) {
        if (!keystate[this.all[this.cur][0][this.i]]) {
          this.cnt = false;
          break;
        }
      }
      if (this.all[this.cur][1] <= 0 && this.cnt) {
        this.all[this.cur][1] = JSON.parse(JSON.stringify(this.all[this.cur][3]));
        this.all[this.cur][2]();
      }
      this.all[this.cur][1]--;
    }
  },
};

keys.add([18,72], 20, function() {
  options.hitboxes = options.hitboxes === false ? true:false;
});

keystate = {};
// keeps track of the keyboard input
document.addEventListener("keydown", function(evt) {
	keystate[evt.keyCode] = true;
});
document.addEventListener("keyup", function(evt) {
	delete keystate[evt.keyCode];
});