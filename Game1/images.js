var images = {
  count: 0,
  loaded: 0,
  
  backgrounds: [
  [[addbackground("Backgrounds/1920x1080/layer_07_1920x1080.png", 0.25, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080/layer_06_1920x1080.png", 0.9, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080/layer_05_1920x1080.png", 1.6, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080/layer_04_1920x1080.png", 2.6, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080/layer_03_1920x1080.png", 4.1, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080/layer_02_1920x1080.png", 7.8, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080/layer_01_1920x1080.png", 13.5, 1920, 1080, 0, 0, 1, 1)]],
  
  [[addbackground("Backgrounds/1920x1080n2/layer_01_1920x1080.png", 0.25, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080n2/layer_02_1920x1080.png", 0.9, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080n2/layer_03_1920x1080.png", 1.6, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080n2/layer_04_1920x1080.png", 2.1, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080n2/layer_05_1920x1080.png", 4.3, 1920, 1080, 0, 0, 0, 1)]],
  
  [[addbackground("Backgrounds/1920x1080n3/layer_08_1920x1080.png", 0.25, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080n3/layer_07_1920x1080.png", 0.7, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080n3/layer_06_1920x1080.png", 1.1, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080n3/layer_05_1920x1080.png", 1.4, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080n3/layer_04_1920x1080.png", 2.3, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080n3/layer_03_1920x1080.png", 2.9, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080n3/layer_02_1920x1080.png", 4.7, 1920, 1080, 0, 0, 0, 1)],
  [addbackground("Backgrounds/1920x1080n3/layer_01_1920x1080.png", 8.3, 1920, 1080, 0, 0, 0, 1)]]
  ],
  
  spritesheets: [
    new spritesheet("Sprites/Tiles/tiles_spritesheet.png", 914, 936),
    new spritesheet("Sprites/Player/p1_walk/p1_walk.png", 256, 512)
  ],
  
  icons: [
    [addimage("Icons/Sound_on.png", 1), addimage("Icons/Sound_off.ico", 1)]
  ],
  
  tiles: [
    []
  ],
  
  characters: [
    {}
  ],
  
  getlength: function(array, depth) {
    for (var i = 0; i < array.length; i++) {
      if (depth > 1) {
        for (var j = 0; j < array[i].length; j++) {
          if (depth > 2) {
            for (var k = 0; k < array[i][j].length; k++) {
              this.count++;
            }
          } else {
            this.count++;
          }
        }
      } else {
        this.count++;
      }
    }
  },
  
  calclength: function() {
    this.getlength(this.backgrounds, 3);
    this.getlength(this.spritesheets, 1);
    this.getlength(this.icons, 2);
    this.getlength(this.tiles, 2);
    this.getlength(this.characters, 2);
  }
};

images.calclength();
images.tiles[0].push(new sprite(images.spritesheets[0], 145, 793, 68, 68, 0));
images.tiles[0].push(new sprite(images.spritesheets[0], 721, 865, 68, 68, 0));
images.characters[0].run = new animation(images.spritesheets[1], true, 0, [
                                                                    {x:0,y:0,w:67,h:92,frame:2},
                                                                    {x:67,y:0,w:66,h:93,frame:4},
                                                                    {x:133,y:0,w:67,h:92,frame:6},
                                                                    {x:0,y:93,w:67,h:93,frame:8},
                                                                    {x:67,y:93,w:66,h:93,frame:10},
                                                                    {x:133,y:93,w:71,h:92,frame:12},
                                                                    {x:0,y:186,w:71,h:93,frame:14},
                                                                    {x:71,y:186,w:71,h:93,frame:16},
                                                                    {x:142,y:186,w:70,h:93,frame:18},
                                                                    {x:0,y:279,w:71,h:93,frame:20},
                                                                    {x:71,y:279,w:67,h:92,frame:22}
                                                                    ]);

function spritesheet(path, width, height) {
  this.img = addimage(path, true);
  this.width = width;
  this.height = height;
}

function sprite(tspritesheet, x, y, width, height, animation, img) {
  if (!animation && tspritesheet) {
    this.path = tspritesheet;
  } else if (!animation && img) {
    this.path = img;
  }
  this.type = "sprite";
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

function animation(tspritesheet, loop, repeat, frames) {
  this.path = tspritesheet;
  this.type = "animation";
  this.frames = frames;
  this.frame = 0;
  this.count = 0;
  this.loop = loop;
  this.repeat = repeat;
  this.cycle = 0;
  this.running = false;
  this.start = function() {
    this.cycle = this.repeat;
    this.frame = 0;
    this.count = 0;
    this.running = true;
  };
  this.update = function(x,y,w,h) {
    console.log();
    ctx.drawImage(this.path.img,this.frames[this.frame].x,this.frames[this.frame].y,this.frames[this.frame].w,
                                   this.frames[this.frame].h,x,y,w,h);
    this.count++;
    if (this.frames[this.frame].frame <= this.count) {
      this.frame++;
    }
    if (this.frame >= this.frames.length) {
      this.cycle--;
      if (this.cycle <= 0 && !this.loop) {
        this.end();
      } else {
        this.frame = 0;
        this.count = 0;
      }
    }
  };
  this.end = function() {
    this.running = false;
  };
}

function addimage(src, doload) {
  tempimage = new Image();
  tempimage.src = src;
  if (doload) {
    tempimage.onload = function() {
      images.loaded++;
      progress.style.width = Math.floor(100*(images.loaded/images.count)) + "%";
      percent.innerHTML = Math.floor(100*(images.loaded/images.count)) + "%";
      if (images.loaded === images.count) {
        document.getElementById("loadtext").innerHTML = "Loaded!";
        if (!background.running) {
          setTimeout(function(){
            window.cancelAnimationFrame(animatestripes);
            init();
            loader.style.visibility = "hidden";
          }, 1000);
        }
      }
    };
  }
  return tempimage;
}

function addbackground(src, speed, width, height, x, y, depth, doload) {
  addimage(src, doload);
  return {img: tempimage, speed: speed, x: x, y: y, width: null, height: null, depth: depth, add: true, basewidth: width, baseheight: height};
}