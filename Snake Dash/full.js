'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (!Date.now) {
  Date.now = function () {
    return new Date().getTime();
  };
}

/**
 * A class that times the real world time
 */

var GameTimer = function () {
  /**
   * Creats a new GameTimer
   *
   * @param {Number=} fps The desired fps
   */
  function GameTimer() {
    var fps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60;

    _classCallCheck(this, GameTimer);

    this.startTime = Date.now();
    this.setFPS(fps);
  }

  /**
   * Sets the desired fps
   *
   * @param {Number=} fps The desired fps
   */


  _createClass(GameTimer, [{
    key: 'setFPS',
    value: function setFPS() {
      var fps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60;

      this.desiredFPS = fps;
      this.multiplier = fps / 1000;

      this.reset();
    }

    /**
     * Resets the game timer
     */

  }, {
    key: 'reset',
    value: function reset() {
      var now = Date.now();

      this.startTime = now;
      this.lastTime = now;
    }

    /**
     * Gets the total time passed since the timer began
     */

  }, {
    key: 'getTotalDifferenceInTime',
    value: function getTotalDifferenceInTime() {
      return Date.now() - this.startTime;
    }

    /**
     * Formats a string (pads it)
     */

  }, {
    key: 'formatString',
    value: function formatString(string, value, amount) {
      var padding = value.repeat(amount);
      var str = padding.concat(string);

      return str.slice(-amount);
    }

    /**
     * Gets the formated time
     */

  }, {
    key: 'getFormattedTime',
    value: function getFormattedTime() {
      var dt = this.getTotalDifferenceInTime();

      var seconds = dt / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;

      seconds = Math.floor(seconds % 60);
      minutes = Math.floor(minutes % 60);
      hours = Math.floor(hours % 100);

      seconds = this.formatString(seconds, '0', 2);
      minutes = this.formatString(minutes, '0', 2);
      hours = this.formatString(hours, '0', 2);

      if (hours !== '00') {
        return hours + ':' + minutes + ':' + seconds;
      }

      return minutes + ':' + seconds;
    }

    /**
     * Updates the current game timer
     */

  }, {
    key: 'updateGameTimer',
    value: function updateGameTimer() {
      var time = this.getFormattedTime();

      $('.play-menu .footer .timer').html(time);
    }

    /**
     * Gets the difference in time since the timer began
     */

  }, {
    key: 'getDifferenceInTime',
    value: function getDifferenceInTime() {
      var now = Date.now();
      var difference = now - this.lastTime;

      this.lastTime = now;

      return difference;
    }

    /**
     * Gets the "dt" or fps in terms of the desired fps
     *  (if the fps is 1 / desired fps, then it will return 1)
     */

  }, {
    key: 'getNormalizedDifferenceInTime',
    value: function getNormalizedDifferenceInTime() {
      var normalized = this.getDifferenceInTime() * this.multiplier;

      if (normalized > 2) {
        return 2;
      }

      return normalized;
    }
  }]);

  return GameTimer;
}();

/**
 * The different states for the StateManager
 */


window.STATES = {
  MAIN_MENU: 0,
  PLAYING: 1
};

/**
 * A class which manages all of the game states
 */

var StateManager = function () {
  /**
   * Creates a new StateManager
   *
   * @param {GameManager} gameManager the parent GameManager
   */
  function StateManager(gameManager) {
    _classCallCheck(this, StateManager);

    this.state = STATES.MAIN_MENU;
    this.gameManager = gameManager;

    this.targets = {
      MAIN_MENU: {
        query: '.main-menu',
        trigger: '.redirect--main-menu'
      },
      PLAYING: {
        query: '.play-menu',
        trigger: '.redirect--play-menu'
      }
    };

    this.overlays = {
      PAUSING: {
        query: '.pause-menu',
        trigger: '.pause'
      }
    };

    this.actions = {};

    this.init();
  }

  /**
   * Initiates and binds the states to the DOM elements
   */


  _createClass(StateManager, [{
    key: 'init',
    value: function init() {
      var data = void 0;

      for (data in this.targets) {
        this.bindTarget(data, this.targets[data]);
      }

      for (data in this.overlays) {
        this.bindOverlay(data, this.overlays[data]);
      }
    }

    /**
     * Binds an action to a change of state event
     *
     * @param {String} state The name of the state id
     * @param {Function} cb The callback to be run when the state changes
     */

  }, {
    key: 'bindAction',
    value: function bindAction(state, cb) {
      this.actions[state] = cb;
    }

    /**
     * Binds a state and its respective target
     *
     * @param {String} state The name of the state id
     * @param {String} query The query selector of the target DOM element
     * @param {String} trigger The query selector of the target trigger button
     */

  }, {
    key: 'bindTarget',
    value: function bindTarget(state, _ref) {
      var _this = this;

      var query = _ref.query,
          trigger = _ref.trigger;

      var STATE_ID = window.STATES[state];
      var $element = $(query);
      var $trigger = $(trigger);

      $trigger.click(function () {
        if (_this.state !== STATE_ID) {
          _this.state = STATE_ID;

          for (var id in _this.targets) {
            var target = _this.targets[id];
            $(target.query).fadeOut(100);
          }

          $element.fadeIn(100);

          var cb = _this.actions[state];
          cb && cb(_this);
        }
      });
    }

    /**
     * Binds an overlay and its respective target
     *
     * @param {String} state The name of the state id
     * @param {String} query The query selector of the target DOM element
     * @param {String} trigger The query selector of the target trigger button
     */

  }, {
    key: 'bindOverlay',
    value: function bindOverlay(state, _ref2) {
      var _this2 = this;

      var query = _ref2.query,
          trigger = _ref2.trigger;

      var $element = $(query);
      var $trigger = $(trigger);
      var $overlay = $('#overlay');

      var active = false;

      $trigger.click(function () {
        if (active) {
          active = false;
          $element.fadeOut(100);
          $overlay.fadeOut(100);
        } else {
          active = true;
          $element.fadeIn(100);
          $overlay.fadeIn(100);

          var cb = _this2.actions[state];
          cb && cb(_this2);
        }
      });
    }
  }]);

  return StateManager;
}();

/**
 * A class that controls all of the front end interactions
 */


var HTMLManager =
/**
 * Creates a new HTMLManager
 */
function HTMLManager() {
  _classCallCheck(this, HTMLManager);
};

/**
 * A class that controls the canvas interactions with PIXI.js
 */


var GameCanvas = function () {
  /**
   * Creates a new GameCanvas
   */
  function GameCanvas(element) {
    _classCallCheck(this, GameCanvas);

    this.root = $(element);

    this.renderer = null;
    this.stage = null;
  }

  /**
   * Resets the Game Canvas and clears the PIXI.js stages
   */


  _createClass(GameCanvas, [{
    key: 'reset',
    value: function reset() {
      var width = this.root.width();
      var height = this.root.height();
      var options = {
        transparent: true
      };

      this.width = width;
      this.height = height;

      this.renderer = PIXI.autoDetectRenderer(width, height, options);
      this.root.append(this.renderer.view);

      this.graphics = new PIXI.Graphics();

      this.stage = new PIXI.Container();
    }

    /**
     * Renders the whole grid system
     *
     * @param {Array} positions The array of positions
     * @param {Number} r The radius of each snake part
     * @param {Array} grid The grid to render
     * @param {Number} size The size of each block
     * @param {Number} slen The length of the snake
     */

  }, {
    key: 'render',
    value: function render(positions, r, slen, grid, size) {
      this.renderer.clear();
      this.graphics.clear();
      this.stage.removeChildren();
      this.graphics.removeChildren();

      this.renderGrid(grid, size);
      this.renderSnake(positions, r, slen);

      this.stage.addChild(this.graphics);

      this.renderer.render(this.stage);
    }

    /**
     * Renders a snake
     * NOTE: Must be called after the renderGrid function
     *
     * @param {Array} positions The array of positions
     * @param {Number} r The radius of each snake part
     * @param {Number} slen The length of the snake
     */

  }, {
    key: 'renderSnake',
    value: function renderSnake(positions, r, slen) {
      var graphics = this.graphics;
      var head = positions[0];

      var slength = (slen + '').length;

      var text = new PIXI.Text(slen, {
        fontFamily: 'Function Regular',
        fontSize: 20,
        fill: 0xffffff
      });
      text.anchor.x = 0.46;
      text.position.set(head.x, head.y - 3.6 * r);

      for (var i = 0; i < positions.length; i++) {
        var part = positions[i];
        var x = part.x,
            y = part.y,
            c = part.c;


        graphics.beginFill(c);
        graphics.lineStyle(0);
        graphics.drawCircle(x, y, r);
        graphics.endFill();
      }

      graphics.addChild(text);
    }

    /**
     * Renders a game grid
     *
     * @param {Array} grid The grid to render
     * @param {Number} size The size of each block
     */

  }, {
    key: 'renderGrid',
    value: function renderGrid(grid, size) {
      this.renderer.clear();
      this.graphics.clear();
      this.stage.removeChildren();
      this.stage.addChild(this.graphics);

      var halfSize = size / 2;

      for (var i = 0; i < grid.length; i++) {
        var block = grid[i];
        var x = block.x,
            y = block.y,
            rotation = block.rotation,
            color = block.color,
            id = block.id,
            scale = block.scale,
            isCircle = block.isCircle;


        if (rotation || scale !== 1) {
          var graphics = new PIXI.Graphics();
          this.stage.addChild(graphics);

          graphics.position.set(x + halfSize, y + halfSize);
          graphics.pivot.set(halfSize, halfSize);
          graphics.scale.set(scale, scale);

          if (isCircle) {
            graphics.beginFill(0x262626);
            graphics.lineStyle(20, color);
            graphics.drawCircle(halfSize, halfSize, halfSize);
            graphics.endFill();
          } else {
            graphics.beginFill(color);
            graphics.rotation = rotation;
            graphics.drawRoundedRect(0, 0, size, size, 10);
            graphics.endFill();
          }
        } else {
          var _graphics = this.graphics;

          if (isCircle) {
            _graphics.beginFill(0x262626);
            _graphics.lineStyle(20, color);
            _graphics.drawCircle(x + halfSize, y + halfSize, halfSize);
            _graphics.endFill();
          } else {
            _graphics.beginFill(color);
            _graphics.drawRoundedRect(x, y, size, size, 10);
            _graphics.endFill();
          }
        }
      }
    }
  }]);

  return GameCanvas;
}();

/**
 * The data id of each grid tile
 */


window.GRID_TILE_IDS = {
  EMPTY_BLOCK: 0,
  ROUND_BLOCK: 1,
  COIN: 2,
  FOOD: 3
};

/**
 * The possible neon colors for each tile
 */
window.GRID_TILE_COLORS = ["#CB3301", "#FF0066", "#FF6666", "#FEFF99", "#FFFF67", "#CCFF66", "#99FE00", "#EC8EED", "#FF99CB", "#FE349A", "#CC99FE", "#6599FF", "#03CDFF", "#FFFFFF"];

(function () {
  function hexadecimal(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);

    return 255 * 255 * r + 255 * g + b;
  }

  var colors = window.GRID_TILE_COLORS;

  for (var i = 0; i < colors.length; i++) {
    colors[i] = hexadecimal(colors[i]);
  }
})();

/**
 * Controls the game's grid system
 */

var GameGrid = function () {
  _createClass(GameGrid, null, [{
    key: 'getRandomTileColor',

    /**
     * Generates a random tile color
     */
    value: function getRandomTileColor() {
      var colors = window.GRID_TILE_COLORS;
      var len = colors.length;
      var index = Math.floor(Math.random() * len);

      return colors[index];
    }

    /**
     * Generates a random tile's data
     */

  }, {
    key: 'getRandomTile',
    value: function getRandomTile() {
      var ids = window.GRID_TILE_IDS;

      var id = Math.random() > 0.2 ? 'ROUND_BLOCK' : Math.random() > 0.95 ? 'COIN' : 'FOOD';

      return {
        id: ids[id],
        color: GameGrid.getRandomTileColor()
      };
    }

    /**
     * Creates a new Game Grid
     *
     * @param {Number} width The number of columns in each grid row
     * @param {GameCanvas} gameCanvas The parent gameCanvas
     */

  }]);

  function GameGrid(width, gameCanvas) {
    _classCallCheck(this, GameGrid);

    this.grid = [];
    this.width = width;
    this.gameCanvas = gameCanvas;
    this.gap = 3;
    this.tileSize = this.gameCanvas.width / this.width - this.gap;
    this.tileSpeed = 0.07;

    this.y = 0;
  }

  /**
   * Generates a random row
   */


  _createClass(GameGrid, [{
    key: 'generateRow',
    value: function generateRow() {
      var size = this.tileSize + this.gap;
      var gap = this.gap;

      var highest = this.getHighestPosition().y;
      if (highest && highest < -size) return;

      var y = highest - size;

      while (y > 0) {
        y -= size;
      }

      while (Math.random() > 0.8) {
        y -= size;
      }

      var row = [];

      for (var i = 0; i < this.width; i++) {
        if (Math.random() > 0.9) {
          var data = GameGrid.getRandomTile();

          var scale = 1;
          var isCircle = false;

          if (data.id === window.GRID_TILE_IDS.COIN) {
            scale = 0.15;
            data.color = 0xffff00;
            isCircle = true;
          }

          if (data.id === window.GRID_TILE_IDS.FOOD) {
            scale = 0.18;
            data.color = 0xff00ff;
          }

          row.push({
            x: i * size + gap / 2,
            y: y,
            rotation: 0,
            size: size - gap,
            oSize: size - gap,
            color: data.color,
            id: data.id,
            scale: scale,
            isCircle: isCircle
          });
        }
      }

      this.grid.push(row);

      this.tileSpeed += 0.0001;
      this.constrainTileSpeed();
    }

    /**
     * Constrains the tile speed
     */

  }, {
    key: 'constrainTileSpeed',
    value: function constrainTileSpeed() {
      if (this.tileSpeed > 0.06) {
        this.tileSpeed = 0.06;
      }
    }

    /**
     * Moves the grid down by a certain number
     *
     * @param {Number} dy The amount to move down by
     */

  }, {
    key: 'moveDown',
    value: function moveDown(dt, timePassed) {
      var size = this.tileSize;
      var dy = size * dt * this.tileSpeed;
      var ids = window.GRID_TILE_IDS;
      var sin = (Math.sin(timePassed) + 7) * 0.02;

      for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
          var tile = this.grid[i][j];

          tile.y += dy;

          if (tile.id === ids.COIN) {
            tile.scale = sin;
          }

          if (tile.id === ids.FOOD) {
            tile.rotation += 0.03;
          }
        }
      }

      this.trimGrid();
    }

    /**
     * Converts the grid to an array
     */

  }, {
    key: 'convertGridToArray',
    value: function convertGridToArray() {
      var array = [];

      for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
          array.push(this.grid[i][j]);
        }
      }

      return array;
    }

    /**
     * Converts the grid to an array ready for collision checking
     */

  }, {
    key: 'convertToCollisionReadyArray',
    value: function convertToCollisionReadyArray() {
      var array = [];
      var ids = window.GRID_TILE_IDS;

      for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
          var block = this.grid[i][j];

          if (block.id !== ids.ROUND_BLOCK) {
            continue;
          }

          array.push({
            min: {
              x: block.x,
              y: block.y
            },
            max: {
              x: block.x + block.size,
              y: block.y + block.size
            }
          });
        }
      }

      return array;
    }

    /**
     * Removes any unnecessary grid tiles that are off the screen
     */

  }, {
    key: 'trimGrid',
    value: function trimGrid() {
      var size = this.tileSize + this.gap;
      var maxY = this.gameCanvas.height + 2 * size;

      for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
          var tile = this.grid[i][j];

          if (tile.y > maxY) {
            this.grid.splice(i, 1);
            i--;
            break;
          }
        }
      }
    }

    /**
     * Gets the first position of the highest block
     */

  }, {
    key: 'getHighestPosition',
    value: function getHighestPosition() {
      var highest = { x: 0, y: Infinity };

      for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
          var position = this.grid[i][j];

          if (position.y < highest.y) {
            highest = position;
          }
        }
      }

      if (highest.y === Infinity) {
        highest.y = 0;
      }

      return highest;
    }
  }]);

  return GameGrid;
}();

/**
 * A class that controls the game snake
 */


var GameSnake = function () {
  /**
   * Creates a new game snake
   */
  function GameSnake(gameCanvas) {
    _classCallCheck(this, GameSnake);

    this.snakeRadius = gameCanvas.width / 50;
    this.gameCanvas = gameCanvas;
    this.positions = [];

    this.positions.push({
      x: gameCanvas.width / 2,
      y: gameCanvas.height - this.snakeRadius,
      c: 0xffff00
    });

    var len = 50;
    for (var i = 0; i < len; i++) {
      this.addPart();
    }

    this.maxY = gameCanvas.height * 0.65;

    this.frozen = false;
  }

  /**
   * Gets the positions of the snake
   */


  _createClass(GameSnake, [{
    key: 'getPositions',
    value: function getPositions() {
      return this.positions;
    }

    /**
     * Adds a part to the snake
     */

  }, {
    key: 'addPart',
    value: function addPart() {
      var tail = this.getTail();
      var y = tail.y + this.snakeRadius * 2;

      this.positions.push({
        x: tail.x,
        y: y,
        c: 0xffff00
      });
    }
  }, {
    key: 'getHead',
    value: function getHead() {
      return this.positions[0];
    }
  }, {
    key: 'getTail',
    value: function getTail() {
      return this.positions[this.positions.length - 1];
    }
  }, {
    key: 'getLength',
    value: function getLength() {
      return this.positions.length;
    }
  }, {
    key: 'moveTo',
    value: function moveTo(x) {
      var min = this.snakeRadius;
      var max = this.gameCanvas.width - this.snakeRadius;

      if (x < min) x = min;
      if (x > max) x = max;

      this.getHead().x = x;
    }
  }, {
    key: 'straighten',
    value: function straighten() {
      var strength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.09;

      if (this.frozen) {
        return;
      }

      var r = 2 * this.snakeRadius;

      var perpAngle = Math.PI / 2;

      for (var i = 1; i < this.positions.length; i++) {
        var last = this.positions[i - 1];
        var curr = this.positions[i];

        // if (Math.abs(curr.x - last.x) < 0.1) {
        //   continue;
        // }

        // curr.x = curr.x + (last.x - curr.x) / 2;

        var dx = curr.x - last.x;
        var dy = curr.y - last.y;

        var angle = Math.atan2(dy, dx);
        angle += (perpAngle - angle) * strength;

        var nx = r * Math.cos(angle);
        var ny = r * Math.sin(angle);

        curr.x = nx + last.x;
        curr.y = ny + last.y;

        // return;

        if (curr.y > this.gameCanvas.height * 5) {
          return;
        }
      }
    }

    /**
     * Updates the GameSnake
     *
     * @param {Number} dt The average normalized fps
     */

  }, {
    key: 'update',
    value: function update(dt) {
      var head = this.getHead();

      if (!(head.y < this.maxY)) {
        for (var i = 0; i < this.positions.length; i++) {
          this.positions[i].y -= 5 * dt;
        }
      }
    }
  }, {
    key: 'moveDown',
    value: function moveDown(dy) {
      for (var i = 0; i < this.positions.length; i++) {
        this.positions[i].y += dy;
      }
    }
  }, {
    key: 'getRenderablePositions',
    value: function getRenderablePositions() {
      var array = [];

      for (var i = 0; i < this.positions.length; i++) {
        var part = this.positions[i];

        if (part.y - this.snakeRadius < this.gameCanvas.height) {
          array.push(part);
        }
      }

      return array;
    }
  }, {
    key: 'convertPositionsIntoCollisionReadyArray',
    value: function convertPositionsIntoCollisionReadyArray() {
      var array = [];

      for (var i = 0; i < this.positions.length; i++) {
        var part = this.positions[i];

        if (part.y + this.snakeRadius < this.gameCanvas.height) {
          array.push({
            min: {
              x: part.x - this.snakeRadius,
              y: part.y - this.snakeRadius
            },
            max: {
              x: part.x + this.snakeRadius,
              y: part.y + this.snakeRadius
            },
            index: i
          });
        }
      }

      return array;
    }
  }]);

  return GameSnake;
}();

/**
 * A class that controls inputs
 */


var InputManager = function () {
  /**
   * Creates a new Input Manager
   */
  function InputManager(gameManager, root) {
    _classCallCheck(this, InputManager);

    this.gameManager = gameManager;
    this.root = $(root);
    this.touchdown = false;
    this.mouse = false;

    this.listen('touchstart mousedown', function (e, self) {
      self.touchdown = true;
      self.updateMouse(e);
    });

    this.listen('touchmove mousemove', function (e, self) {
      self.updateMouse(e);
    });

    this.listen('touchend mouseup', function (e, self) {
      self.touchdown = false;
    });
  }

  _createClass(InputManager, [{
    key: 'updateMouse',
    value: function updateMouse(e) {
      var touch = e.touches ? e.touches[0] : e;
      var offset = this.root.offset();

      var x = touch.clientX - offset.left;
      var y = touch.clientY - offset.top;

      this.mouse = { x: x, y: y };

      this.constrainMouse();
    }
  }, {
    key: 'constrainMouse',
    value: function constrainMouse() {
      var r = this.gameManager.gameCanvas.root;
      var w = r.width;
      var h = r.height;
      var m = this.mouse;

      if (m.x < 0) m.x = 0;
      if (m.y < 0) m.y = 0;
      if (m.x > w) m.x = w;
      if (m.y > h) m.y = h;
    }
  }, {
    key: 'listen',
    value: function listen(types, cb) {
      var self = this;
      var events = types.split(' ');

      var callback = function callback(e) {
        if (self.gameManager.gameIsRunning) {
          cb(e, self);
        }
      };

      for (var i = 0; i < events.length; i++) {
        this.root.on(events[i], callback);
      }
    }
  }]);

  return InputManager;
}();

/**
 * Class that Controls the Game Logic
 */


var GameManager = function () {
  /**
   * Creates a new GameManager
   */
  function GameManager() {
    _classCallCheck(this, GameManager);

    this.stateManager = new StateManager(this);
    this.inputManager = new InputManager(this, '.game-screen');

    this.gameIsRunning = false;

    var self = this;
    this.stateManager.bindAction('PLAYING', function (stateManager) {
      window.setTimeout(function () {
        self.reset();
        self.gameTimer.reset();

        self.gameIsRunning = true;

        self.initLoop();
      }, 100);
    });
  }

  /**
   * Resets the game
   */


  _createClass(GameManager, [{
    key: 'reset',
    value: function reset() {
      this.HTMLManager = new HTMLManager();
      this.gameTimer = new GameTimer();
      this.gameCanvas = new GameCanvas('.game-screen');
      this.gameCanvas.reset();

      this.gameGrid = new GameGrid(5, this.gameCanvas);
      this.gameSnake = new GameSnake(this.gameCanvas);

      this.highscore = 0;
      this.frame = 0;

      this.gameIsRunning = false;
    }

    /**
     * Initializes the game loop
     */

  }, {
    key: 'initLoop',
    value: function initLoop() {
      window.requestAnimationFrame(this.initLoop.bind(this));
      this.loop();
    }

    /**
     * Does all of the game logic
     */

  }, {
    key: 'loop',
    value: function loop() {
      this.frame++;

      var dt = this.gameTimer.getNormalizedDifferenceInTime();
      var deltaTime = this.gameTimer.getTotalDifferenceInTime();

      this.gameGrid.moveDown(dt, deltaTime / 1000);
      this.gameGrid.generateRow();

      var snakeMoving = false;

      if (this.inputManager.mouse) {
        var _inputManager$mouse = this.inputManager.mouse,
            x = _inputManager$mouse.x,
            y = _inputManager$mouse.y;


        var sx = this.gameSnake.getHead().x;

        var strength = 0;
        if (Math.abs(sx - x) > 2) {
          var easing = (sx - x) * 0.8;

          this.gameSnake.moveTo(x + easing);

          var w = this.gameCanvas.width;

          if (sx - x > w / 2) {
            strength = 0.02;
          } else if (sx - x > w / 4) {
            strength = 0.04;
          } else if (sx - x > w / 8) {
            strength = 0.06;
          } else if (sx - x > w / 16) {
            strength = 0.13;
          } else {
            strength = 0.17;
          }
        } else {
          strength = 0.2;
        }

        this.gameSnake.straighten(strength * dt);
      }

      this.gameSnake.update(dt);

      // CollisionManager.solve(this.gameSnake, this.gameGrid);

      var grid = this.gameGrid.convertGridToArray();
      var snake = this.gameSnake.getRenderablePositions();

      this.gameCanvas.render(snake, this.gameSnake.snakeRadius, this.gameSnake.getLength(), grid, this.gameGrid.tileSize);

      this.gameTimer.updateGameTimer();

      var score = this.gameSnake.positions.length;
      $('.header .score').html(score);

      if (score > this.highscore) {
        this.highscore = score;
        $('.header .highscore div').html(score);
      }

      if (this.frame % 4 === 0) $('#fps').html('FPS: ' + Math.round(1000 / (Date.now() - window.lastTime)));window.lastTime = Date.now();
    }
  }]);

  return GameManager;
}();

var CollisionManager = function () {
  function CollisionManager() {
    _classCallCheck(this, CollisionManager);
  }

  _createClass(CollisionManager, null, [{
    key: 'solve',
    value: function solve(snake, grid) {}
  }, {
    key: 'solveIndividual',
    value: function solveIndividual(part, block, isHead) {}
  }]);

  return CollisionManager;
}();

$(function () {
  return new GameManager();
});
