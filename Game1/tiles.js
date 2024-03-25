var added = 0;
//tiletype, hitbox, xpos, ypos, lw, imgnum
//"solid", "ssf"
var levels = [newlevel(
               [[["solid","ssf",8,0],["solid","ssf",9,1],1],
                [["solid","ssf",8,0],["solid","none",9,1],2],
                [["solid","ssf",8,0],["solid","none",9,1],3],
                [["solid","ssf",8,0],["solid","none",9,1],4],
                [["solid","ssf",8,0],["solid","none",9,1],5],
                [["solid","ssf",8,0],["solid","none",9,1],6],
                [["solid","ssf",8,0],["solid","none",9,1],7],
                [["solid","ssf",8,0],["solid","none",9,1],8],
                [["solid","ssf",8,0],["solid","none",9,1],9],
                [["solid","ssf",8,0],["solid","ssf",9,1],10]],14)
              ];

var tiles = {
  height: 10,
  tw: null, //tilewidth
  th: null, //tileheight
  ts: null, //tilespeed
  running: false,
  templevel: null,
  num: null,
  resizing: false,
  curnumid: 0,
  
  map: [],
  hitboxes: {},
  
  init: function(tilespeed, num) {
    this.hitboxes = {};
    this.curnumid = 0;
    this.map = [];
    this.ts = tilespeed;
    this.tw = this.th = canvas.height/this.height;
    this.num = num;
    this.addlevel(0);
    this.running = true;
  },
  
  addlevel: function(xpos) {
    this.templevel = JSON.parse(JSON.stringify(levels[Math.floor(Math.random()*levels.length)]));
    //add level and change x and y data...
    var x1len = this.templevel.length;
    for (var x1 = 0; x1 < x1len; x1++) {
      var y1len = this.templevel[x1].length;
      for (var y1 = 0; y1 < y1len; y1++) {
        this.templevel[x1][y1].x = xpos + this.templevel[x1][y1].xpos*this.tw;
        this.templevel[x1][y1].y = this.templevel[x1][y1].ypos*this.th;
        if (this.templevel[x1][y1].hitbox !== "none") {
          this.curnumid++;
          this.templevel[x1][y1].id = this.curnumid;
          this.hitboxes[this.curnumid] = {};
          this.hitboxes[this.curnumid].updatepos = function(x,y) {
            this.x = x;
            this.y = y;
          };
          this.hitboxes[this.curnumid].updatepos(this.templevel[x1][y1].x, this.templevel[x1][y1].y);
          this.hitboxes[this.curnumid].hb = nhitbox(this.templevel[x1][y1].hitbox);
        } else {
          this.templevel[x1][y1].id = false;
        }
      }
      this.map.push(JSON.parse(JSON.stringify(this.templevel[x1])));
    }
  },
  
  update: function() {
    var xlen = this.map.length;
    for (var x = 0; x < xlen; x++) {
      var ylen = this.map[x].length;
      for (var y = 0; y < ylen; y++) {
        if (this.map[x][y].x+this.tw < 0) {
          if (this.map[x][y].id) {
            for (y = 0; y < ylen; y++) {
              delete this.hitboxes[this.map[x][y].id];
            }
          }
          this.map.splice(x, 1);
          xlen--;
          x--;
          break;
        }
        this.map[x][y].x -= this.ts/1366*canvas.width;
        if (this.map[x][y].id) {
          this.hitboxes[this.map[x][y].id].updatepos(this.map[x][y].x,this.map[x][y].y);
        }
        ctx.drawImage(images.tiles[this.num][this.map[x][y].imgnum].path.img,images.tiles[this.num][this.map[x][y].imgnum].x,images.tiles[this.num][this.map[x][y].imgnum].y,images.tiles[this.num][this.map[x][y].imgnum].width,images.tiles[this.num][this.map[x][y].imgnum].height,this.map[x][y].x,this.map[x][y].y,this.tw,this.th);
      }
    }
    
    var ttempcalc = this.map[this.map.length-1][this.map[this.map.length-1].length-1].x +
                   (this.map[this.map.length-1][this.map[this.map.length-1].length-1].lw+1 -
                    this.map[this.map.length-1][this.map[this.map.length-1].length-1].xpos) * this.tw;
    if (ttempcalc < canvas.width) {
      this.addlevel(ttempcalc);
    }
    if (options.hitboxes) {
      ctx.strokeStyle="gray";
      ctx.lineWidth="3";
      ctx.beginPath();
      for (x in this.hitboxes) {
        ctx.moveTo(this.hitboxes[x].x, this.hitboxes[x].y);
        var zlen = this.hitboxes[x].hb.length;
        for (var z = 0; z < zlen; z++) {
          ctx.lineTo(this.hitboxes[x].x+this.hitboxes[x].hb[z].x*this.tw, this.hitboxes[x].y+this.hitboxes[x].hb[z].y*this.th);
        }
        ctx.lineTo(this.hitboxes[x].x+this.hitboxes[x].hb[0].x*this.tw, this.hitboxes[x].y+this.hitboxes[x].hb[0].y*this.th);
      }
      ctx.stroke();
      ctx.closePath();
    }
  },
  
  end: function() {
    this.hitboxes = {};
    this.curnumid = 0;
    this.map = [];
    this.running = false;
    this.ts = this.tw = this.th = this.templevel = this.num = null;
  }
};

var templeveldata;

function newlevel(array, lw) {
  templeveldata = [];
  for (var x = 0; x < array.length; x++) {
    templeveldata.push([]);
    for (var y = 0; y < array[x].length; y++) {
      if (array[x][y].length) {
        templeveldata[x].push(new tile(array[x][y][0],array[x][y][1],array[x][y][2],array[x][y][3],array[x][array[x].length-1]-1,lw-1));
      }
    }
  }
  return templeveldata;
}

//solid, platform, fallingS, fallingP, box, enemy, empty
//movable - true/false
//gravity - true/false
//fall - true/false

function tile(tiletype, hitbox, ypos, imgnum, xpos, lw) {
  this.xpos = xpos;
  this.ypos = ypos;
  this.lw = lw;
  this.imgnum = imgnum;
  if (tiletype === "solid" || tiletype === "platform" || tiletype === "enemy") {
    this.type = tiletype;
    this.movable = false;
    this.gravity = false;
    this.fall = false;
  } else if (tiletype === "fallingS" || tiletype === "fallingP") {
    this.movable = false;
    this.gravity = false;
    this.fall = true;
  } else if (tiletype === "box") {
    this.type = "solid";
    this.movable = true;
    this.gravity = true;
    this.fall = false;
  } else if (tiletype === "empty" || !tiletype) {
    this.type = "empty";
    this.movable = false;
    this.gravity = false;
    this.fall = false;
  }
  this.type = (!this.type && "fallingS") ? "solid" : (!this.type && "fallingP") ? "platform" : this.type;
  this.hitbox = (hitbox === "no" || hitbox === "none" || !hitbox) ? "none":hitbox;
}

function nhitbox(hitbox) {
  switch (hitbox) {
    //solid-square-full
    case "ssf":
      return [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 0, y: 1}
        ];
      
    //solid-square-top-half
    case "ssth":
      return [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 0.5},
        {x: 0, y: 0.5}
        ];
      
    //solid-square-bottom-half
    case "sqbh":
      return [
        {x: 0, y: 0.5},
        {x: 1, y: 0.5},
        {x: 1, y: 1},
        {x: 0, y: 1}
        ];
      
    //solid-square-middle
    case "sqm":
      return [
          {x: 0, y: 0.25},
          {x: 1, y: 0.25},
          {x: 1, y: 0.75},
          {x: 0, y: 0.75}
        ];
      
    //solid-triangle-bottom-right
    case "stbr":
      return [
        {x: 0, y: 1},
        {x: 1, y: 0},
        {x: 1, y: 1}
        ];
      
    //solid-triangle-bottom-left
    case "stbl":
      return [
        {x: 0, y: 0},
        {x: 1, y: 1},
        {x: 0, y: 1}
        ];
      
    //solid-triangle-top-right
    case "sttr":
      return [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 0, y: 1}
        ];
      
    //solid-triangle-top-left
    case "sttl":
      return [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1}
        ];
      
    //platform-top
    case "pt":
      return [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 0.2},
        {x: 0, y: 0.2}
        ];
      
    //platform-bottom
    case "pb":
      return [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 0.8},
        {x: 0, y: 0.8}
        ];
      
    //platform-middle
    case "pm":
      return [
        {x: 0, y: 0.4},
        {x: 1, y: 0.4},
        {x: 1, y: 0.6},
        {x: 0, y: 0.6}
        ];
      
    //spikes-bottom
    case "sb":
      return [
        {x: 0, y: 0.4},
        {x: 1, y: 0.4},
        {x: 1, y: 1},
        {x: 0, y: 1}
        ];
      
    //spikes-left
    case "sl":
      return [
        {x: 0, y: 0},
        {x: 0.6, y: 0},
        {x: 0.6, y: 1},
        {x: 0, y: 1}
        ];
      
    //spikes-top
    case "st":
      return [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 0.6},
        {x: 0, y: 0.6}
        ];
      
    //spikes-right
    case "sr":
      return [
        {x: 0.4, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 0.4, y: 1}
        ];
      
    //box-square
    case "bs":
      return [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 0, y: 1}
        ];
  }
}