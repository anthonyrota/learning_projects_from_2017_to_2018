function character(gravity,sx,sy,damage,bodydamage,bulletdamage,bulletspeed,bulletgravity,bulletangle,tyv,tcs,to,imagepath) {
  this.x = null;
  this.y = null;
  this.vx = null;
  this.vy = null;
  this.nx = null;
  this.ny = null;
  this.hitbox = null;
  this.width = null;
  this.height = null;
  this.curanim = null;
  this.path = imagepath;
  this.active = false;
  this.stats = {
    gravity: gravity,
    sx: sx,
    sy: sy,
    damage: damage,
    bodydamage: bodydamage
  };
  
  this.state = {
    underneath: false,
    still: false,
    jumping: false,
    crouching: false,
    sliding: false,
    shooting: false,
    attacking: false
  };
  
  this.animations = {
    run: imagepath.run
  };
  
  this.bullets = {
    all: [],
    stats: {
      damage: bulletdamage,
      speed: bulletspeed,
      gravity: bulletgravity,
      angle: bulletangle
    },
    update: function() {
      
    },
    add: function(x,y,vx,vy) {
      
    }
  };
  
  this.trail = {
    all: [],
    colors: tcs,
    cur: 0,
    ordered: to,
    yvariant: tyv,
    update: function() {
      
    },
    add: function(x,y) {
      
    }
  };
  
  this.changeanim = function(anim) {
    if (this.curanim) {
      this.path[this.curanim].end;
    }
    this.curanim = anim;
    this.path[this.curanim].start;
  };
  
  this.shoot = function() {
    
  };
  
  this.attack = function() {
    
  };
  
  this.init = function(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.active = true;
    this.changeanim("run");
  };
  
  this.draw = function() {
    this.path[this.curanim].update(this.x,this.y,this.width,this.height);
  };
  
  this.update = function() {
    this.draw();
  };
  
  this.end = function() {
    
  };
}