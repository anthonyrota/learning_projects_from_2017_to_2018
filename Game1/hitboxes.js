var quadtree = {
  cur: [],
  start: function() {
    this.reset;
    this.get;
  },
  get: function() {
    
  },
  reset: function() {
    
  }
};

var entities = {
  player: {
    hitboxes: [],
    collide: [] //tiles enemies items projectiles
  },
  
  tiles: {
    hitboxes: [],
    collide: []
  },
  
  enemies: {
    hitboxes: [],
    collide: [] //tiles
  },
  
  items: {
    hitboxes: [],
    collide: [] //tiles
  },
  
  projectiles: {
    hitboxes: [],
    collide: [] //player tiles enemies
  },
  
  collisions: {
    all: [],
    add: function(type1, type2, callback) {
      
    },
    check: function(type) {
      
    },
    detect: function(shape1, shape2, response) {
      
    }
  }
};