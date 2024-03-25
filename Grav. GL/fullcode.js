'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.options = {
  sound: true,

  toggle: function toggle(prop) {
    this[prop] = !this[prop];
    return this[prop];
  }
};

var Text = function () {
  function Text(element) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    _classCallCheck(this, Text);

    this.element = element;
    this.text(value);
  }

  _createClass(Text, [{
    key: 'text',
    value: function text(val) {
      var element = this.element;


      var child = element.firstChild;
      var node = document.createTextNode(val);

      if (child) element.removeChild(child);

      element.appendChild(node);
    }
  }]);

  return Text;
}();

String.prototype.get = function () {
  return this;
};
String.prototype.copy = function () {
  return this;
};
String.prototype.fade = function () {
  return this;
};

var RGBA = function () {
  function RGBA() {
    var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    _classCallCheck(this, RGBA);

    this.r = Math.round(r);
    this.g = Math.round(g);
    this.b = Math.round(b);
    this.a = Math.round(a);
  }

  _createClass(RGBA, [{
    key: 'get',
    value: function get() {
      var r = this.r,
          g = this.g,
          b = this.b,
          a = this.a;

      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    }
  }, {
    key: 'fade',
    value: function fade() {
      var strength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.95;

      this.a *= strength;
      return this;
    }
  }, {
    key: 'exists',
    value: function exists() {
      return this.a > 0.01;
    }
  }, {
    key: 'copy',
    value: function copy() {
      var r = this.r,
          g = this.g,
          b = this.b,
          a = this.a;

      return new RGBA(r, g, b, a);
    }
  }], [{
    key: 'random',
    value: function random() {
      var alpha = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _random(0, 1);

      return new RGBA(_random(0, 255), _random(0, 255), _random(0, 255), alpha);
    }
  }]);

  return RGBA;
}();

var calculateAttraction = function calculateAttraction(a, b) {
  var force = a.pos.clone().sub(b.pos).normalize();

  var dist = force.len2();
  dist = constrain(dist, 0.01, 1000);

  var strength = AG * a.mass * b.mass / dist;

  force.scale(strength);
  return force;
};

var constrain = function constrain(a, min, max) {
  if (a < min) return min;
  if (a > max) return max;
  return a;
};

var cloneVectorArray = function cloneVectorArray(a) {
  var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : a.length;

  var copy = [];
  for (var i = 0; i < len; i++) {
    copy[i] = a[i].clone();
  }
  return copy;
};

var copyVectorArray = function copyVectorArray(a, output) {
  var len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : a.length;

  for (var i = 0; i < len; i++) {
    output[i].copy(a[i]);
  }
  return output.slice(0, len);
};

var formatString = function formatString(string, value, amount) {
  var padding = value.repeat(amount);
  var str = padding.concat(string);

  return str.slice(-amount);
};

var firstCharUpperCase = function firstCharUpperCase(string) {
  return string.charAt(0).toUpperCase().concat(string.slice(1));
};

var _random = function _random(min) {
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.random() * (max - min) + min;
};

var randomInt = function randomInt(min, max) {
  return Math.floor(_random(min, max + 1));
};
var AUDIO_STORAGE = {};

var LoadSound = function LoadSound(name, src) {
  AUDIO_STORAGE[name] = new Audio(src);
};

var PlaySound = function PlaySound(name) {
  if (window.options.sound) {
    var src = AUDIO_STORAGE[name].src;
    var audio = new Audio(src);

    audio.play();
    return audio;
  }

  return false;
};

LoadSound('shootCannon', 'assets/shoot_cannon_sound.mp3');
LoadSound('hitTarget', 'assets/hit_target_sound.mp3');

var CanvasRatioManager = function () {
  function CanvasRatioManager(canvas, element, ratio) {
    _classCallCheck(this, CanvasRatioManager);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.element = element || false;
    this.elementSizing = {
      width: 0,
      height: 0
    };

    this.borderLeft = 0;
    this.borderTop = 0;
    this.left = 0;
    this.right = 0;

    this.setRatio(ratio);
    this.calcSize();
  }

  _createClass(CanvasRatioManager, [{
    key: 'clearScreen',
    value: function clearScreen() {
      var ctx = this.ctx;
      var canvas = this.canvas;
      var width = canvas.width;
      var height = canvas.height;

      ctx.clearRect(0, 0, width, height);
    }
  }, {
    key: 'resize',
    value: function resize(w, h) {
      var width = w - this.borderLeft * 2;
      var height = h - this.borderTop * 2;

      this.canvas.width = width;
      this.width = width;

      this.canvas.height = height;
      this.height = height;

      this.area = width * height;
    }
  }, {
    key: 'setRatio',
    value: function setRatio(ratio) {
      this.ratio = ratio;
      this.inv_ratio = 1 / ratio;
    }
  }, {
    key: 'getBestFit',
    value: function getBestFit() {
      var elementSizing = this.elementSizing;


      var width = elementSizing.width;
      var height = elementSizing.height;

      var elementArea = width * height;

      var ratio = this.ratio;
      var invRatio = this.inv_ratio;

      var fullWidth = {
        width: width,
        height: width * invRatio
      };

      var fullHeight = {
        width: height * ratio,
        height: height
      };

      var area1 = fullWidth.width * fullWidth.height;
      var area2 = fullHeight.width * fullHeight.height;

      if (area1 > elementArea) {
        return fullHeight;
      }

      if (area2 > elementArea) {
        return fullWidth;
      }

      if (area1 > area2) {
        return fullWidth;
      }

      return fullHeight;
    }
  }, {
    key: 'calcSize',
    value: function calcSize() {
      var element = this.element,
          elementSizing = this.elementSizing;


      if (element) {
        elementSizing.width = element.clientWidth;
        elementSizing.height = element.clientHeight;
      } else {
        elementSizing.width = window.innerWidth;
        elementSizing.height = window.innerHeight;
      }

      var size = this.getBestFit();

      this.resize(size.width, size.height);
    }
  }, {
    key: 'border',
    value: function border(height) {
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#000';

      var style = this.canvas.style;
      var width = height * this.ratio;

      style.borderStyle = 'solid';
      style.borderColor = color;

      style.borderLeftWidth = width + 'px';
      style.borderRightWidth = width + 'px';

      style.borderTopWidth = height + 'px';
      style.borderBottomWidth = height + 'px';

      this.borderLeft = width;
      this.borderTop = height;

      this.calcSize();
      this.center();
    }
  }, {
    key: 'setPos',
    value: function setPos(x, y) {
      var style = this.canvas.style;

      style.position = 'relative';

      if (x) {
        var left = x - this.borderLeft;

        style.left = left + 'px';
        this.left = left;
      }

      if (y) {
        var top = y - this.borderTop;

        style.top = top + 'px';
        this.top = top;
      }
    }
  }, {
    key: 'center',
    value: function center() {
      var elementSizing = this.elementSizing,
          canvas = this.canvas;


      var x = elementSizing.width - canvas.width;
      var y = elementSizing.height - canvas.height;

      x *= 0.5;
      y *= 0.53;

      this.setPos(x, y);
    }
  }], [{
    key: 'create',
    value: function create(canvas, element, ratio) {
      return new CanvasRatioManager(canvas, element, ratio);
    }
  }]);

  return CanvasRatioManager;
}();

var Renderer = function () {
  function Renderer(ctx) {
    _classCallCheck(this, Renderer);

    this.ctx = ctx;
  }

  _createClass(Renderer, [{
    key: 'gradient',
    value: function gradient(x, y, inner, outer, stops, amount) {
      var gradient = this.ctx.createRadialGradient(x, y, inner, x, y, outer);

      for (var i = 0; i < amount; i++) {
        var stop = stops[i].get();
        gradient.addColorStop(i, stop);
      }

      return gradient;
    }
  }, {
    key: 'polygon',
    value: function polygon(points, pos, r, fillColor, strokeColor, strokeWidth) {
      var colorStops = [fillColor, strokeColor];
      var gradient = this.gradient(pos.x, pos.y, r * 0.1, r * 1.5, colorStops, 2);
      var ctx = this.ctx;

      ctx.fillStyle = gradient;
      ctx.strokeStyle = strokeColor.get();
      ctx.lineWidth = strokeWidth * 2;

      var point = points[0];

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);

      for (var i = 0; i < points.length; i++) {
        var _point = points[i];
        ctx.lineTo(_point.x, _point.y);
      }

      ctx.closePath();

      ctx.save();
      ctx.clip();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }, {
    key: 'circle',
    value: function circle(pos, r, fillColor, strokeColor, strokeWidth) {
      var colorStops = [fillColor, strokeColor];
      var gradient = this.gradient(pos.x, pos.y, r * 0.1, r * 2, colorStops, 2);
      var ctx = this.ctx;

      ctx.fillStyle = gradient;
      ctx.strokeStyle = strokeColor.get();
      ctx.lineWidth = strokeWidth;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r - strokeWidth * 0.25, 0, TWO_PI);
      ctx.closePath();

      ctx.stroke();
      ctx.fill();
    }
  }, {
    key: 'box',
    value: function box(pos, w, h, angle, fillColor) {
      var ctx = this.ctx;
      var begin = -w * 0.5;

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(angle - HALF_PI);

      ctx.fillStyle = fillColor.get();
      ctx.fillRect(begin, 0, w, h);

      ctx.restore();
    }
  }, {
    key: 'point',
    value: function point(pos, fillColor) {
      var ctx = this.ctx;

      ctx.fillStyle = fillColor.get();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 2, 0, TWO_PI);
      ctx.closePath();
      ctx.fill();
    }
  }], [{
    key: 'create',
    value: function create(ctx) {
      return new Renderer(ctx);
    }
  }]);

  return Renderer;
}();

var RenderRatio = function () {
  function RenderRatio(ctx, ratio) {
    _classCallCheck(this, RenderRatio);

    this.ctx = ctx;

    this.ratio = ratio;
    this.inv_ratio = 1 / ratio;

    this.widthAdjust = ratio * 0.036;

    this.render = Renderer.create(ctx);

    this.TVECS = [];
    for (var i = 0; i < 50; i++) {
      this.TVECS.push(Vector.create());
    }
  }

  _createClass(RenderRatio, [{
    key: 'polygon',
    value: function polygon(points, pos, r, fillColor, strokeColor, strokeWidth) {
      var offset = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : { x: 0, y: 0 };

      var len = points.length;
      var ratio = this.ratio;
      var adjust = this.widthAdjust;

      var list = copyVectorArray(points, this.TVECS, len);

      for (var i = 0; i < len; i++) {
        list[i].add(offset).scale(ratio);
      }

      var position = this.TVECS.pop().copy(pos).add(offset).scale(ratio);

      this.render.polygon(list, position, r * ratio, fillColor, strokeColor, adjust * strokeWidth);
      this.TVECS.push(position);
    }
  }, {
    key: 'circle',
    value: function circle(pos, r, fillColor, strokeColor, strokeWidth) {
      var offset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : { x: 0, y: 0 };

      var ratio = this.ratio;
      var adjust = this.widthAdjust;
      var position = this.TVECS.pop().copy(pos).add(offset).scale(ratio);
      var radius = r * ratio;

      this.render.circle(position, radius, fillColor, strokeColor, adjust * strokeWidth);
      this.TVECS.push(position);
    }
  }, {
    key: 'box',
    value: function box(pos, w, h, angle, fillColor, strokeColor, strokeWidth) {
      var offset = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : { x: 0, y: 0 };

      var ratio = this.ratio;
      var adjust = this.widthAdjust;
      var position = this.TVECS.pop().copy(pos).add(offset).scale(ratio);
      var width = w * ratio;
      var height = h * ratio;

      this.render.box(position, width, height, angle, fillColor, strokeColor, adjust * strokeWidth);
      this.TVECS.push(position);
    }
  }, {
    key: 'point',
    value: function point(pos, fillColor) {
      var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { x: 0, y: 0 };

      var position = this.TVECS.pop().copy(pos).add(offset).scale(this.ratio);

      this.render.point(position, fillColor);
      this.TVECS.push(position);
    }
  }], [{
    key: 'create',
    value: function create(ctx, ratio) {
      return new RenderRatio(ctx, ratio);
    }
  }]);

  return RenderRatio;
}();

var InputManager = function () {
  function InputManager(element) {
    var _this = this;

    _classCallCheck(this, InputManager);

    this.element = element;

    this.mouse = Vector.create();
    this.drag = false;
    this.keystates = {};

    this.add('document-keydown', function (e) {
      _this.keystates[e.keyCode] = true;
    });

    this.add('document-keyup', function (e) {
      delete _this.keystates[e.keyCode];
    });

    this.add('mousedown', function (e) {
      e.preventDefault();
      var rect = _this.element.getBoundingClientRect();
      _this.drag = _this.contains(rect, e.clientX, e.clientY);
    });

    this.add('mouseup touchend', function (e) {
      e.preventDefault();
      _this.drag = false;
    });

    this.add('mousemove', function (e) {
      e.preventDefault();

      var rect = _this.element.getBoundingClientRect();
      _this.mouse.x = e.clientX - rect.left;
      _this.mouse.y = e.clientY - rect.top;

      if (_this.drag && !_this.contains(rect, e.clientX, e.clientY)) {
        _this.drag = false;
      }
    });

    this.add('touchstart', function (e) {
      var rect = _this.element.getBoundingClientRect();
      var touch = e.touches[0];
      _this.mouse.x = touch.clientX - rect.left;
      _this.mouse.y = touch.clientY - rect.top;
      _this.drag = _this.contains(rect, touch.clientX, touch.clientY);
    });

    this.add('touchmove', function (e) {
      var rect = _this.element.getBoundingClientRect();
      var touch = e.touches[0];
      _this.mouse.x = touch.clientX - rect.left;
      _this.mouse.y = touch.clientY - rect.top;
      _this.drag = _this.contains(rect, touch.clientX, touch.clientY);
    });
  }

  _createClass(InputManager, [{
    key: 'contains',
    value: function contains(rect, x, y) {
      var mouse = this.mouse;

      return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
    }
  }, {
    key: 'add',
    value: function add(events, callback) {
      var array = events.split(' ');

      for (var i = 0; i < array.length; i++) {
        var event = array[i];

        if (event.includes('window-')) {
          var name = event.slice(7);

          window.addEventListener(name, callback);
          continue;
        }

        if (event.includes('document-')) {
          var _name = event.slice(9);

          window.addEventListener(_name, callback);
        }

        window.addEventListener(event, callback);
      }
    }
  }], [{
    key: 'create',
    value: function create(element) {
      return new InputManager(element);
    }
  }]);

  return InputManager;
}();

var World = function () {
  function World(canvas, ratio, size, element) {
    _classCallCheck(this, World);

    this.inGame = false;
    this.element = element;

    this.ratio = ratio;
    this.inv_ratio = 1 / ratio;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.canvasRatio = CanvasRatioManager.create(canvas, element, ratio);
    this.canvasRatio.center();

    this.inputManager = InputManager.create(canvas);

    this.size = size;
    this.referenceFrame = 0;
    this.moversHit = 0;
    this.scoreQueue = 0;

    this.saveDimensions();
    this.calcSize();

    this.render = RenderRatio.create(this.ctx, this.scale);
    this.SAT = SAT.create();
    this.manifold = Manifold.create();

    this.reset();

    this.cannon = Cannon.create(this);
    this.target = Target.create(this);
  }

  _createClass(World, [{
    key: 'resize',
    value: function resize() {
      var canvasRatio = this.canvasRatio,
          ctx = this.ctx,
          scale = this.scale,
          cannon = this.cannon;


      canvasRatio.calcSize();
      canvasRatio.center();

      this.saveDimensions();
      this.calcSize();

      this.render = RenderRatio.create(ctx, scale);

      if ('cannon' in this) cannon.resize();
      if (this.inGame) this.setBorders();
    }
  }, {
    key: 'calcSize',
    value: function calcSize() {
      var width = this.size;
      var invRatio = this.inv_ratio;
      var renderWidth = this.renderWidth;

      this.width = width;
      this.height = width * invRatio;
      this.scale = renderWidth / width;
    }
  }, {
    key: 'saveDimensions',
    value: function saveDimensions() {
      var canvas = this.canvasRatio;

      this.renderWidth = canvas.width;
      this.renderheight = canvas.height;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.inGame = false;

      this.movers = [1];
      this.statics = [1];
      this.gravities = [1];
      this.borders = [1];

      this.resize();

      this.shaking = false;
      this.shakeStrength = 0;
      this.shakeCount = 0;
      this.shakePeriod = 0;

      this.offset = Vector.create();

      this.referenceFrame = 0;
      this.score = 0;
      this.scoreQueue = 0;
      this.scoreInc = 0;
      this.moversHit = 0;

      this.setBorders();
    }
  }, {
    key: 'init',
    value: function init() {
      this.reset();
      this.setBorders();

      this.inGame = true;
    }
  }, {
    key: 'setCannon',
    value: function setCannon(firstColor, strokeColor, secondColor, percentX, percentY, baseRadius, barrelWidth, barrelHeight, projectile) {
      var base = Cannon.base.create(this, percentX, percentY, baseRadius, barrelWidth, barrelHeight);
      var cannon = Cannon.create(this, firstColor, strokeColor, secondColor, base, projectile);

      this.cannon = cannon;
    }
  }, {
    key: 'setTarget',
    value: function setTarget(size, pos, width, color) {
      var target = Target.create(this, size, pos, width, color);

      this.target = target;
    }
  }, {
    key: 'setBorders',
    value: function setBorders() {
      this.borders = [1];

      var width = this.width,
          height = this.height;

      var THREE_WIDTH = 3 * width;
      var THREE_HEIGHT = 3 * height;

      var points = [Vector.create(), Vector.create(THREE_WIDTH), Vector.create(THREE_WIDTH, THREE_HEIGHT), Vector.create(0, THREE_HEIGHT)];

      var type = 'border';

      var pos1 = Vector.create(width * 0.5, -height * 1.5);
      var pos2 = Vector.create(width * 2.5, height * 0.5);
      var pos3 = Vector.create(width * 0.5, height * 2.5);
      var pos4 = Vector.create(-width * 1.5, height * 0.5);

      var poly1 = Polygon.create(pos1, cloneVectorArray(points), 1, 1);
      var poly2 = Polygon.create(pos2, cloneVectorArray(points), 1, 1);
      var poly3 = Polygon.create(pos3, cloneVectorArray(points), 1, 1);
      var poly4 = Polygon.create(pos4, cloneVectorArray(points), 1, 1);

      var borders = [[type, Body.create(poly1)], [type, Body.create(poly2)], [type, Body.create(poly3)], [type, Body.create(poly4)]];

      this.add(borders);
    }
  }, {
    key: 'add',
    value: function add(bodies) {
      for (var i = 0; i < bodies.length; i++) {
        var arr = bodies[i];

        var type = arr[0];
        var body = arr[1];
        var def = arr[2];

        var name = firstCharUpperCase(type);
        var func = 'add'.concat(name);

        this[func](body, def);
      }
    }
  }, {
    key: 'addMover',
    value: function addMover(body, def) {
      body.applyDef(def);

      var movers = this.movers;


      movers.push(body);
      movers[0] = movers.length;
    }
  }, {
    key: 'addStatic',
    value: function addStatic(body, def) {
      body.applyDef(def);

      var statics = this.statics;


      statics.push(body);
      statics[0] = statics.length;
    }
  }, {
    key: 'addGravity',
    value: function addGravity(body, def) {
      body.applyDef(def);

      var gravities = this.gravities;


      gravities.push(body);
      gravities[0] = gravities.length;
    }
  }, {
    key: 'addBorder',
    value: function addBorder(body, def) {
      body.applyDef(def);

      var borders = this.borders;


      borders.push(body);
      borders[0] = borders.length;
    }
  }, {
    key: 'remove',
    value: function remove(indexes) {
      for (var i = 0; i < indexes.length; i++) {
        var arr = indexes[i];

        var type = arr[0];
        var index = arr[1];

        var name = firstCharUpperCase(type);
        var func = 'remove'.concat(name);

        this[func](index);
      }
    }
  }, {
    key: 'removeMover',
    value: function removeMover(index) {
      var movers = this.movers;


      movers.splice(index, 1);
      movers[0] = movers.length;
    }
  }, {
    key: 'removeStatic',
    value: function removeStatic(index) {
      var statics = this.statics;


      statics.splice(index, 1);
      statics[0] = statics.length;
    }
  }, {
    key: 'removeGravity',
    value: function removeGravity(index) {
      var gravities = this.gravities;


      gravities.splice(index, 1);
      gravities[0] = gravities.length;
    }
  }, {
    key: 'removeBorder',
    value: function removeBorder(index) {
      var borders = this.borders;


      borders.splice(index, 1);
      borders[0] = borders.length;
    }
  }, {
    key: 'shake',
    value: function shake() {
      var strength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.3;
      var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
      var period = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

      this.shaking = true;
      this.shakeStrength = strength;
      this.shakeCount = count;
      this.shakePeriod = period;

      this.offset.reset();
    }
  }, {
    key: 'stopShaking',
    value: function stopShaking() {
      this.shaking = false;
      this.shakeStrength = 0;
      this.shakeCount = 0;
      this.shakePeriod = 0;

      this.offset.reset();
    }
  }, {
    key: 'updateShaking',
    value: function updateShaking() {
      if (this.shaking) {
        var doShake = randomInt(0, this.shakePeriod) === 0;

        if (doShake) {
          var strength = this.shakeStrength;
          var offset = Vector.randomFromBox(strength);

          this.offset = offset;
        }

        this.shakeCount--;

        if (this.shakeCount <= 0) this.stopShaking();
      }
    }
  }, {
    key: 'update',
    value: function update() {
      this.referenceFrame++;

      this.updateShaking();

      var movers = this.movers,
          gravities = this.gravities,
          statics = this.statics,
          borders = this.borders,
          manifold = this.manifold,
          cannon = this.cannon,
          target = this.target,
          SAT = this.SAT;


      manifold.reset();

      var i = void 0;
      var j = void 0;
      var len = void 0;

      len = movers[0];

      for (i = 1; i < len; i++) {
        var mover = movers[i];
        var shape = mover.shape;
        var notHitTargetYet = !movers[i].hitTarget;

        mover.update();

        var result = SAT.collision(shape, target.hitbox, manifold);
        if (result && notHitTargetYet) {
          this.addScore(582, 5);
          PlaySound('hitTarget');

          mover.shrink();
          mover.hitTarget = true;
          mover.vel.scale(0.5);

          this.moversHit++;
        }

        var _len = void 0;

        if (notHitTargetYet) {
          _len = gravities[0];
          for (j = 1; j < _len; j++) {
            var gravity = gravities[j];
            var attraction = calculateAttraction(gravity.shape, shape);

            mover.applyForce(attraction);
          }

          _len = statics[0];
          for (j = 1; j < _len; j++) {
            result = SAT.solveCollision(mover, statics[j], manifold);
            if (result) break;
          }

          _len = borders[0];
          for (j = 1; j < _len; j++) {
            result = SAT.solveCollision(mover, borders[j], manifold);
            if (result) break;
          }
        }
      }

      var len2 = borders[0];

      len = statics[0];
      for (i = 1; i < len; i++) {
        var Static = statics[i];
        Static.update(true);

        for (j = 1; j < len2; j++) {
          var border = borders[j];

          SAT.solveCollision(Static, border, manifold, true);
        }
      }

      len = gravities[0];
      for (i = 1; i < len; i++) {
        var _gravity = gravities[i];
        _gravity.update(true);

        for (j = 1; j < len2; j++) {
          var _border = borders[j];

          SAT.solveCollision(_gravity, _border, manifold, true);
        }
      }

      var list = [];
      var exists = void 0;

      len2 = movers[0];
      for (i = 1; i < len2; i++) {
        exists = movers[i].exists();

        if (!exists) {
          this.addScore(-10);
          list.push(['mover', i]);
        }
      }

      len2 = statics[0];
      for (i = 1; i < len2; i++) {
        exists = statics[i].exists();

        if (!exists) {
          list.push(['static', i]);
        }
      }

      len2 = gravities[0];
      for (i = 1; i < len2; i++) {
        exists = gravities[i].exists();

        if (!exists) {
          list.push(['gravity', i]);
        }
      }

      this.remove(list);

      cannon.update();
      target.oscilate(0.04, 0.2);

      this.addScore(-1);
      this.updateScore();
    }
  }, {
    key: 'updateScore',
    value: function updateScore() {
      var scoreInc = this.scoreInc,
          scoreQueue = this.scoreQueue;


      this.addScore(scoreInc);
      this.scoreQueue--;

      if (this.scoreQueue <= 0) {
        this.scoreQueue = 0;
        this.scoreInc = 0;
      }
    }
  }, {
    key: 'addScore',
    value: function addScore(amount, period) {
      if (period) {
        this.scoreInc = Math.floor(amount / period);
        this.scoreQueue = period;
      } else {
        var score = this.score + amount;

        this.score = constrain(score, 0, Number.MAX_VALUE);
      }
    }
  }, {
    key: 'renderScene',
    value: function renderScene() {
      var cannon = this.cannon,
          target = this.target,
          statics = this.statics,
          gravities = this.gravities,
          movers = this.movers,
          offset = this.offset,
          canvasRatio = this.canvasRatio;


      canvasRatio.clearScreen();

      var i = void 0;
      var len = void 0;

      len = statics[0];
      for (i = 1; i < len; i++) {
        this.renderBody(statics[i]);
      }

      len = gravities[0];
      for (i = 1; i < len; i++) {
        this.renderBody(gravities[i]);
      }

      len = movers[0];
      for (i = 1; i < len; i++) {
        this.renderBody(movers[i]);
      }

      cannon.render({
        x: offset.x,
        y: offset.y * 0.2
      });

      target.render();
    }
  }, {
    key: 'renderBody',
    value: function renderBody(body, noOffset) {
      var offset = noOffset ? false : this.offset;

      var shape = body.shape,
          fillColor = body.fillColor,
          strokeColor = body.strokeColor,
          strokeWidth = body.strokeWidth;
      var type = shape.type,
          pos = shape.pos,
          r = shape.r;


      if (type === TYPE_POLYGON) {
        var points = shape.calcPoints;

        this.render.polygon(points, pos, r, fillColor, strokeColor, strokeWidth, offset);
        return;
      }

      this.render.circle(pos, r, fillColor, strokeColor, strokeWidth, offset);
    }
  }, {
    key: 'border',
    value: function border(width, color) {
      this.canvasRatio.border(width, color);

      this.resize();
    }
  }], [{
    key: 'create',
    value: function create(canvas, ratio, size, element) {
      return new World(canvas, ratio, size, element);
    }
  }]);

  return World;
}();

var Def = function () {
  function Def() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Def);

    this.set(options);
  }

  _createClass(Def, [{
    key: 'set',
    value: function set(options) {
      var defaults = {
        vel: Vector.create(),
        angle: 0,
        rotate: 0,
        fillColor: '#000',
        strokeColor: RGBA.random(1),
        strokeWidth: 8,
        oscilate: false,
        oscilationStrength: 0,
        minOscilatonSize: 0,
        oscilationSpeed: 0,
        restitution: 0.9,
        shrinkSpeed: 0.95,
        enemy: false,
        lifespan: false
      };

      for (var value in defaults) {
        if (value in options) {
          this[value] = options[value];
        } else {
          this[value] = defaults[value];
        }
      }

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      var clone = {};

      for (var value in this) {
        clone[value] = function (v) {
          if (v instanceof Vector) return v.clone();
          if (v instanceof RGBA) return v.copy();
          return v;
        }(this[value]);
      }

      return clone;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.set({});
      return this;
    }
  }], [{
    key: 'create',
    value: function create(options) {
      return new Def(options);
    }
  }]);

  return Def;
}();

// const Def = class {
//     constructor(options = {}) {
//         this.set(options);
//     }
//
//     static create(options) {
//         return new Def(options);
//     }
// };

var Cannon = function () {
  function Cannon(world) {
    var fillColor1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#111';
    var strokeColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#464646';
    var fillColor2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#111';
    var base = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Cannon.base.create(world);
    var proj = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

    _classCallCheck(this, Cannon);

    this.world = world;

    this.inputManager = world.inputManager;
    this.ctx = world.ctx;
    this.mouse = world.inputManager.mouse;
    this.w = world.width;

    this.projectile = {};
    this.set(proj);

    this.base = base;
    this.fireVec = Vector.create();

    this.fillColor1 = fillColor1;
    this.fillColor2 = fillColor2;
    this.strokeColor = strokeColor;
  }

  _createClass(Cannon, [{
    key: 'set',
    value: function set(definition) {
      var projectile = this.projectile;


      var defaults = {};

      defaults.speed = this.w * 0.007;

      defaults.def = Def.create({
        oscilate: true,
        oscilationStrength: 0.03,
        minOscilationSize: 0.5,
        oscilationSpeed: 10,
        restitution: 0.6,
        shrinkSpeed: 0.8,
        lifespan: 100,
        fillColor: '#111',
        strokeColor: '#111'
      });

      defaults.points = [Vector.create(0.72, 0.32), Vector.create(1.50, 0.68), Vector.create(0.72, 1.04), Vector.create(0.50, 0.68)];

      defaults.size = 1;
      defaults.firerate = 5;
      defaults.density = 1;

      for (var name in defaults) {
        if (name in definition) {
          this.projectile[name] = definition[name];
        } else {
          this.projectile[name] = defaults[name];
        }
      }
    }
  }, {
    key: 'assign',
    value: function assign(propName, value) {
      this.projectile[propName] = value;
    }
  }, {
    key: 'update',
    value: function update() {
      var world = this.world,
          mouse = this.mouse,
          projectile = this.projectile;


      var outline = world.canvasRatio;
      var frame = world.referenceFrame;

      var speed = projectile.speed,
          firerate = projectile.firerate;


      var x = mouse.x - outline.borderLeft;
      var y = mouse.y - outline.borderTop;

      var pos = Vector.create(x, y);

      this.base.head(pos, projectile.speed);

      if (this.inputManager.drag) {
        this.base.extend();

        if (frame % firerate === 0) {
          this.fire();
        }
      } else {
        this.base.unextend();
      }
    }
  }, {
    key: 'createBody',
    value: function createBody(pos) {
      var projectile = this.projectile;
      var points = projectile.points,
          density = projectile.density,
          size = projectile.size;


      var vertices = cloneVectorArray(points);

      var shape = Polygon.create(pos, vertices, density, size);

      return Body.create(shape);
    }
  }, {
    key: 'fire',
    value: function fire() {
      PlaySound('shootCannon');

      var def = this.projectile.def.clone();
      var vel = this.base.fireVec.clone();
      var pos = this.base.firePos.clone();

      var body = this.createBody(pos);

      def.vel = vel;

      this.world.addMover(body, def);
    }
  }, {
    key: 'render',
    value: function render(offset) {
      this.base.render(this.fillColor1, this.strokeColor, this.fillColor2, offset);
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.base.resize();
    }
  }], [{
    key: 'create',
    value: function create(world, f1c, s1c, f2c, base, proj) {
      return new Cannon(world, f1c, s1c, f2c, base, proj);
    }
  }]);

  return Cannon;
}();

Cannon.base = function () {
  function _class(world) {
    var percentX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
    var percentY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 99.6;
    var baseRadius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var barrelWidth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.8;
    var barrelHeight = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 2;

    _classCallCheck(this, _class);

    this.percentX = percentX * 0.01;
    this.percentY = percentY * 0.01;

    this.baseRadius = baseRadius;
    this.barrelWidth = barrelWidth;
    this.barrelHeight = barrelHeight;

    this.world = world;
    this.minSize = this.barrelHeight;
    this.maxSize = this.barrelHeight * 1.3;
    this.incSize = this.barrelHeight * 0.04;

    this.angle = -HALF_PI;
    this.prevAngle = 0;
    this.tempAngle = 0;
    this.easing = 0;
    this.easingCount = 0;
    this.prevState = 0;

    this.pos = Vector.create();
    this.firePos = Vector.create();
    this.fireVec = Vector.create();

    this.resize();
  }

  _createClass(_class, [{
    key: 'resize',
    value: function resize() {
      this.scale = this.world.render.inv_ratio;

      var x = this.percentX * this.world.width;
      var y = this.percentY * this.world.height;

      this.pos.set(x, y);
      this.firePos.reset();
      this.fireVec.reset();
    }
  }, {
    key: 'extend',
    value: function extend() {
      if (this.barrelHeight < this.maxSize) {
        this.barrelHeight += this.incSize;
      } else {
        this.barrelHeight = this.maxSize;
      }
    }
  }, {
    key: 'unextend',
    value: function unextend() {
      if (this.barrelHeight > this.minSize) {
        this.barrelHeight -= this.incSize;
      } else {
        this.barrelHeight = this.minSize;
      }
    }
  }, {
    key: 'head',
    value: function head(pos, speed) {
      this.fireVec.copy(pos).scale(this.scale);
      this.fireVec.sub(this.pos).setMag(speed);

      var angle = this.fireVec.getAngle();
      if (angle < 0) angle += TWO_PI;

      // check if mouse crossed the bottom
      if (angle < HALF_PI) {
        if (this.prevState === 2) {
          // mouse did cross so ease the transition
          this.easingCount = 12;
          this.easing = PI / 12;
        }

        angle = 0;

        // update the previous state so the angle
        // does not get updated more than once
        this.prevState = 1;
      } else if (angle < PI && angle > HALF_PI) {
        if (this.prevState === 1) {
          // mouse did cross so ease the transition
          this.easingCount = 12;
          this.easing = -PI / 12;
        }

        angle = PI;

        // update the previous state so the angle
        // does not get updated more than once
        this.prevState = 2;
      } else {
        // mouse didn't cross so reset the state
        this.prevState = 0;
      }

      this.prevAngle = this.angle;
      this.tempAngle = angle;

      this.smooth();
    }
  }, {
    key: 'smooth',
    value: function smooth() {
      var diff = this.tempAngle - this.prevAngle;
      var absDiff = abs(diff);

      if (this.easingCount) {
        this.easingCount--;
        this.angle += this.easing;

        if (this.easingCount < 1) {
          this.easingCount = 0;
        }
      } else if (VERSION_PHONE && absDiff > 0.01 && !this.prevState) {
        this.easing = diff * 0.2;
        this.easingCount = 5;
      } else {
        this.angle = this.tempAngle;
      }

      this.firePos.set(this.barrelHeight);
      this.firePos.rotate(this.angle).add(this.pos);
    }
  }, {
    key: 'render',
    value: function render(fillColor1, strokeColor, fillColor2, offset) {
      var pos = this.pos,
          baseRadius = this.baseRadius,
          barrelWidth = this.barrelWidth,
          barrelHeight = this.barrelHeight,
          angle = this.angle,
          world = this.world;


      world.render.box(pos, barrelWidth, barrelHeight, angle, fillColor1, 'rgba(0, 0, 0, 0)', 1, offset);
      world.render.circle(pos, baseRadius, fillColor2, strokeColor, 0.1, offset);
    }
  }], [{
    key: 'create',
    value: function create(w, px, py, br, bw, bh) {
      return new Cannon.base(w, px, py, br, bw, bh);
    }
  }]);

  return _class;
}();

var Target = function () {
  function Target(world) {
    var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : SIDE_TOP;
    var pos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : world.width * 0.5;
    var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : world.width * 0.3;
    var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : RGBA.random(1);

    _classCallCheck(this, Target);

    this.world = world;

    this.set(side, pos, width);

    this.color = color;
    this.oscilationCount = 0;

    this.TVECS = [Vector.create(), Vector.create(), Vector.create(), Vector.create()];
  }

  _createClass(Target, [{
    key: 'set',
    value: function set(side, pos, width) {
      this.side = side;
      this.pos = pos;

      this.width = width;
      this.originalWidth = width;

      this.hitbox = null;
      this.calc();
    }
  }, {
    key: 'calc',
    value: function calc() {
      var points = [Vector.create(0, 0), Vector.create(1, 0), Vector.create(1, 1), Vector.create(0, 1)];

      var world = this.world,
          pos = this.pos,
          width = this.width,
          side = this.side;


      var halfWidth = width * 0.47;

      var position = function () {
        switch (side) {
          case SIDE_LEFT:
            return Vector.create(-halfWidth, pos);

          case SIDE_TOP:
            return Vector.create(pos, -halfWidth);

          case SIDE_RIGHT:
            return Vector.create(world.width + halfWidth, pos);

          case SIDE_BOTTOM:
            return Vector.create(pos, world.height + halfWidth);
        }
      }();

      this.hitbox = Polygon.create(position, points, 1, width);
    }
  }, {
    key: 'change',
    value: function change(prop, value) {
      this[prop] = value;
      this.calc();
    }
  }, {
    key: 'oscilate',
    value: function oscilate(speed) {
      var strength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      this.oscilationCount += speed;

      var count = this.oscilationCount;
      var width = this.originalWidth;
      var theta = count + width;
      var cos = Math.cos(theta);

      var size = abs(cos * strength + width);
      this.change('width', size);
    }
  }, {
    key: 'move',
    value: function move(amount) {
      var pos = this.pos + amount;
      this.change('pos', pos);
    }
  }, {
    key: 'render',
    value: function render() {
      var calcPoints = this.hitbox.calcPoints;
      var points = copyVectorArray(calcPoints, this.TVECS, 4);
      var ctx = this.world.ctx;
      var color = this.color.get();
      var world = this.world;
      var scale = world.scale;

      ctx.save();
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 100 * world.ratio;

      for (var i = 0; i < 4; i++) {
        points[i].scale(scale);
      }

      var point = points[0];

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);

      for (var _i = 0; _i < 4; _i++) {
        point = points[_i];
        ctx.lineTo(point.x, point.y);
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }], [{
    key: 'create',
    value: function create(w, s, p, W, c) {
      return new Target(w, s, p, W, c);
    }
  }]);

  return Target;
}();

var Timer = function () {
  function Timer() {
    _classCallCheck(this, Timer);

    this.restart();
  }

  _createClass(Timer, [{
    key: 'restart',
    value: function restart() {
      this.startTime = Date.now();
      this.savedTime = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
    }
  }, {
    key: 'timePassed',
    value: function timePassed() {
      var time = Date.now();
      var diff = time - this.startTime;

      return diff;
    }
  }, {
    key: 'update',
    value: function update() {
      var diff = this.timePassed();

      var seconds = diff * 0.001;
      var minutes = seconds / 60;
      var hours = minutes / 60;

      seconds = Math.floor(seconds % 60);
      minutes = Math.floor(minutes % 60);
      hours = Math.floor(hours % 100);

      this.seconds = formatString(seconds, '0', 2);
      this.minutes = formatString(minutes, '0', 2);
      this.hours = formatString(hours, '0', 2);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.savedTime = this.timePassed();
    }
  }, {
    key: 'start',
    value: function start() {
      this.startTime += this.timePassed() - this.savedTime;
    }
  }, {
    key: 'hasHours',
    value: function hasHours() {
      return this.hours !== '00';
    }
  }, {
    key: 'get',
    value: function get() {
      this.update();

      var hours = this.hours,
          minutes = this.minutes,
          seconds = this.seconds;


      if (this.hasHours()) {
        return hours + ':' + minutes + ':' + seconds;
      }

      return minutes + ':' + seconds;
    }
  }], [{
    key: 'create',
    value: function create() {
      return new Timer();
    }
  }]);

  return Timer;
}();

var GameManager = function () {
  function GameManager() {
    var _this2 = this;

    _classCallCheck(this, GameManager);

    this.ratio = 12 / 17;
    this.size = 26;

    this.canvas = document.getElementById('game-canvas');
    this.info = document.getElementById('info');
    this.stats = document.getElementById('stats');
    this.screen = document.getElementById('game-screen');
    this.pause = document.getElementById('pause');
    this.coinImage = document.getElementById('coins-svg');
    this.closePause = document.getElementById('close-pause');
    this.continueBtn = document.getElementById('pause-button--continue');
    this.restartBtn = document.getElementById('pause-button--restart');

    var main = document.getElementById('simulation-container');
    var score = document.getElementById('score');
    var coinImage = document.getElementById('coins-image');
    var stats = document.getElementById('stats');
    var pause = document.getElementById('pause-screen');

    this.container = { main: main, score: score, coinImage: coinImage, stats: stats, pause: pause };

    var scoreText = document.getElementById('score-value');
    var coinsText = document.getElementById('coins-value');
    var timerText = document.getElementById('timer-value');
    var hitTargetText = document.getElementById('targets-hit-value');

    this.text = {
      score: new Text(scoreText, '0'),
      coins: new Text(coinsText, '10'),
      timer: new Text(timerText, '00:00'),
      hitTarget: new Text(hitTargetText, '70 | 500')
    };

    this.paused = false;

    var handlePauseClick = function handlePauseClick(e) {
      return window.setTimeout(function () {
        _this2.paused = true;
        _this2.timer.stop();
      }, 120);
    };

    this.pause.addEventListener('mousedown', handlePauseClick);
    this.pause.addEventListener('touchstart', handlePauseClick);

    var handleClosePause = function handleClosePause(e) {
      return window.setTimeout(function () {
        _this2.paused = false;
        _this2.timer.start();
      }, 80);
    };

    this.closePause.addEventListener('mousedown', handleClosePause);
    this.closePause.addEventListener('touchstart', handleClosePause);
    this.continueBtn.addEventListener('mousedown', handleClosePause);
    this.continueBtn.addEventListener('touchstart', handleClosePause);

    var handleRestartGame = function handleRestartGame(e) {
      return window.setTimeout(function () {
        handleClosePause();
        _this2.restart();
      }, 90);
    };

    this.restartBtn.addEventListener('mousedown', handleRestartGame);
    this.restartBtn.addEventListener('touchstart', handleRestartGame);

    var canvas = this.canvas,
        ratio = this.ratio,
        size = this.size,
        screen = this.screen;


    this.world = World.create(canvas, ratio, size, screen);
    this.world.init();

    this.timer = Timer.create();
    this.timer.restart();
  }

  _createClass(GameManager, [{
    key: 'restart',
    value: function restart() {
      this.world.reset();
      this.timer.restart();

      this.world.init();

      var world = this.world;
      var width = world.width,
          height = world.height;

      var halfWidth = width * 0.5;
      var halfHeight = height * 0.5;

      {
        var pos = Vector.create(halfWidth, halfHeight);
        var circle = Circle.create(pos, 1.5, 0.5);
        var body = Body.create(circle);
        var def = Def.create({
          oscilate: true,
          oscilationStrength: 0.05,
          minOscilationSize: 0.5,
          oscilationSpeed: 10,
          rotate: 1,
          vel: Vector.create(_random(-0.1, 0.1), _random(-0.2, 0.2))
        });

        world.addGravity(body, def);
      }

      {
        var amount = 10;

        for (var i = 0; i < amount; i++) {
          var _pos = Vector.randomFromBox(width / 3, height / 3).add(Vector.create(halfWidth, halfHeight));

          var _def = Def.create({
            oscilate: true,
            oscilationStrength: 0.05,
            minOscilationSize: 0.5,
            oscilationSpeed: 10,
            angle: _random(0, TWO_PI),
            rotate: _random(-0.05, 0.05),
            vel: Vector.create(_random(-0.1, 0.1), _random(-0.1, 0.1))
          });
          var sides = randomInt(3, 8);

          var poly = RegularPolygon.create(_pos, sides, 1, 2);
          var _body = Body.create(poly);

          world.addStatic(_body, _def);
        }
      }

      world.shake(0.7, 105);

      this.resize();
    }
  }, {
    key: 'resize',
    value: function resize() {
      var canvas = this.canvas,
          container = this.container,
          world = this.world,
          info = this.info,
          pause = this.pause,
          coinImage = this.coinImage;


      world.resize();

      var canvasBounds = canvas.getBoundingClientRect();
      var containerBounds = container.main.getBoundingClientRect();

      var ratio = world.canvasRatio;

      var height = canvasBounds.top - containerBounds.top;
      var width = canvasBounds.right - containerBounds.left;
      var screenHeight = containerBounds.bottom - containerBounds.top;

      height = constrain(height, 0, screenHeight * 0.13);

      var fullWidth = containerBounds.right - containerBounds.left;
      var infoLeft = (fullWidth - width) / 2;

      info.style.left = infoLeft + 'px';
      info.style.height = height + 'px';
      info.style.width = width + 'px';

      var pauseHeight = height * 0.7;

      pause.style.height = pauseHeight + 'px';
      pause.style.width = pauseHeight + 'px';

      var score = container.score;
      var scoreLeft = width * 0.04 + pauseHeight;

      score.style.left = scoreLeft + 'px';

      var coin = container.coinImage;
      var radius = height * 0.1;
      var radiusWidth = radius * 0.25;
      var coinLeft = width - 3 * radius;

      coinImage.setAttribute('r', radius);
      coinImage.setAttribute('stroke-width', radiusWidth);

      coin.style.marginLeft = coinLeft + 'px';

      var coinText = this.text.coins.element;
      var coinTextRight = radius * 4.7;

      coinText.style.right = coinTextRight + 'px';

      var stats = container.stats;

      height = containerBounds.bottom - canvasBounds.bottom;

      stats.style.left = infoLeft + 'px';
      stats.style.width = width + 'px';
      stats.style.height = height + 'px';
    }
  }, {
    key: 'update',
    value: function update() {
      var container = this.container,
          canvas = this.canvas;
      var pause = container.pause;

      var ctx = this.world.ctx;

      if (this.paused) {
        canvas.style.opacity = '0.2';

        window.setTimeout(function () {
          pause.style.opacity = '.7';
        }, 80);

        pause.style.display = 'block';

        return;
      }

      this.world.renderScene();

      if (canvas.style.opacity !== '1' || pause.style.opacity !== '0' || pause.style.display !== 'none') {
        pause.style.opacity = '0';

        window.setTimeout(function () {
          canvas.style.opacity = '1';
        }, 80);

        window.setTimeout(function () {
          pause.style.display = 'none';
        }, 200);
      }

      this.world.update();

      var _text = this.text,
          score = _text.score,
          timer = _text.timer,
          hitTarget = _text.hitTarget;


      var targetToHit = 500;
      var moversHit = constrain(this.world.moversHit, 0, targetToHit);

      var hitText = '' + moversHit;
      if (hitText.length === 1) {
        hitText = _SPACE.concat(hitText);
      }

      score.text('' + this.world.score);
      timer.text('' + this.timer.get());
      hitTarget.text(hitText + ' / ' + targetToHit);
    }
  }]);

  return GameManager;
}();

var Caption = function () {
  function Caption(ctx, text, pos, size) {
    _classCallCheck(this, Caption);

    this.ctx = ctx;
    this.text = text;
    this.pos = pos;
    this.size = size;
    this.vel = Vector.create();
    this.color = new RGBA(255, 255, 255);
  }

  _createClass(Caption, [{
    key: 'update',
    value: function update() {
      this.pos.add(this.vel);
      this.render();
      this.fade(0.85);
    }
  }, {
    key: 'exists',
    value: function exists() {
      return this.color.exists();
    }
  }, {
    key: 'float',
    value: function float(vel) {
      this.vel = vel;
    }
  }, {
    key: 'fade',
    value: function fade(n) {
      this.color.fade(n);
    }
  }, {
    key: 'render',
    value: function render() {
      var ctx = this.ctx,
          color = this.color,
          pos = this.pos,
          text = this.text,
          size = this.size;


      ctx.save();
      ctx.font = size + 'px \'Function Regular\'';
      ctx.fillStyle = color.get();
      ctx.fillText(text, pos.x, pos.y);
      ctx.restore();
    }
  }]);

  return Caption;
}();

var PI = Math.PI;
var TWO_PI = 2 * PI;
var HALF_PI = PI * 0.5;

var abs = Math.abs;
var AG = 0.00367408;

var TYPE_BOX = 0;
var TYPE_CIRCLE = 1;
var TYPE_POLYGON = 2;

var SIDE_LEFT = 0;
var SIDE_TOP = 1;
var SIDE_RIGHT = 2;
var SIDE_BOTTOM = 3;

var _SPACE = '\xA0';

var VERSION_PHONE = function () {
  var check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}();
/**
 * Class representing a point in the cartesian plane
 * @class Vector
 * @classdesc Creates a new Vector Object
 */

var Vector = function () {
  /**
   * Creates a new Vector
   * @param {x=} x The x coordinate
   * @param {y=} y The y coordinate
   */
  function Vector() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Vector);

    /**
     * The x coordinate of the Vector
     * @name Vector#x
     * @type {number}
     * @default 0
     * @instance
     */
    this.x = x;
    /**
     * The y coordinate of the Vector
     * @name Vector#y
     * @type {number}
     * @default 0
     * @instance
     */
    this.y = y;
  }

  /**
   * Sets the position of the Vector
   * @param {number=} x The x coordinate
   * @param {number=} y The y coordinate
   * @returns {Vector} This is for chaining
   */


  _createClass(Vector, [{
    key: 'set',
    value: function set() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      this.x = x;
      this.y = y;
      return this;
    }

    /**
     * Resets the Vectors x and y values
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.x = 0;
      this.y = 0;
      return this;
    }

    /**
     * Gets the angle of the Vector
     * @returns {number} The calculated angle
     */

  }, {
    key: 'getAngle',
    value: function getAngle() {
      return Math.atan2(this.y, this.x);
    }

    /**
     * Adds the values of the Vector to another
     * @param {Vector} other The other Vector to add too
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'add',
    value: function add(other) {
      this.x += other.x;
      this.y += other.y;
      return this;
    }

    /**
     * Subtracts the values of the Vector from another
     * @param {Vector} other The other Vector to subtract from
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'sub',
    value: function sub(other) {
      this.x -= other.x;
      this.y -= other.y;
      return this;
    }

    /**
     * Scales the vector by a given amount
     * @param {number} x The x amount to scale by
     * @param {number=} y The y amount to scale by
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'scale',
    value: function scale(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;

      this.x *= x;
      this.y *= y;
      return this;
    }

    /**
     * Copies the values of another Vector into this one
     * @param {Vector} other The Vector to copy
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'copy',
    value: function copy(other) {
      this.x = other.x;
      this.y = other.y;
      return this;
    }

    /**
     * Gives a new Vector with the same properties
     * Used to avoid Object references and allows for deep clones
     * @returns {Vector} The clones Vector
     */

  }, {
    key: 'clone',
    value: function clone() {
      return Vector.create(this.x, this.y);
    }

    /**
     * Turns the Vector 90 degrees clockwise
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'perp',
    value: function perp() {
      var x = this.x;
      this.x = this.y;
      this.y = -x;
      return this;
    }

    /**
     * Rotates the Vector by a given amount
     * @param {number} angle The angle to rotate by in radians
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'rotate',
    value: function rotate(angle) {
      // clone values of this Vector
      var x = this.x;
      var y = this.y;

      // get sin and cosin of angle
      var c = Math.cos(angle);
      var s = Math.sin(angle);

      // use rotational transform to rotate
      this.x = x * c - y * s;
      this.y = x * s + y * c;

      return this;
    }

    /**
     * Flips the Vector 180 degrees
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'reverse',
    value: function reverse() {
      this.x = -this.x;
      this.y = -this.y;
      return this;
    }

    /**
     * Sets the Vectors magnitude to one
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'normalize',
    value: function normalize() {
      // Get magnitude
      var dist = this.len();

      if (dist > 0) {
        // Divide by magnitude to get length equal to one
        this.x /= dist;
        this.y /= dist;
      }

      return this;
    }

    /**
     * Projects the Vector onto another
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'project',
    value: function project(other) {
      var a = this.dot(other) / other.len2();

      this.x = a * other.x;
      this.y = a * other.y;
      return this;
    }

    /**
     * Projects the Vector onto a normalized Vector
     * A bit more efficient
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'projectN',
    value: function projectN(other) {
      var a = this.dot(other);

      this.x = a * other.x;
      this.y = a * other.y;
      return this;
    }

    /**
     * Reflects the Vector along a given axis
     * @param {Vector} axis The axis to reflect on
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'reflect',
    value: function reflect(axis) {
      var x = this.x;
      var y = this.y;

      this.project(axis).scale(2);
      this.x -= x;
      this.y -= y;
      return this;
    }

    /**
     * Reflects the Vector along a normalized axis
     * @param {Vector} axis The axis to reflect on
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'reflectN',
    value: function reflectN(axis) {
      var x = this.x;
      var y = this.y;

      this.projectN(axis).scale(2);
      this.x -= x;
      this.y -= y;
      return this;
    }

    /**
     * Returns the distance multiplied by the other Vectors
     * Length when projected onto another Vector
     * @param {Vector} other The Vector to dot against
     * @returns {number} The dot product
     */

  }, {
    key: 'dot',
    value: function dot(other) {
      return this.x * other.x + this.y * other.y;
    }

    /**
     * Gets the length squared of the Vector
     * @returns {number} The length Squared
     */

  }, {
    key: 'len2',
    value: function len2() {
      return this.dot(this);
    }

    /**
     * Gets the magnitude of the Vector
     * @returns {number} The magnitude of the Vector
     */

  }, {
    key: 'len',
    value: function len() {
      return Math.sqrt(this.len2());
    }

    /**
     * Crosses the Vector onto another
     * Can be visualized as the area of the Parrallelogram formed
     * By the two Vectors combined around coordinate (0, 0)
     * @param {Vector} other The other Vector to be crossed against
     * @returns {number} The cross product
     */

  }, {
    key: 'cross',
    value: function cross(other) {
      return this.x * other.y - this.y * other.x;
    }

    /**
     * Sets the magnitude of the Vector to the given value
     * @param {number} mag The resulting magnitude
     * @returns {Vector} This is for chaining
     */

  }, {
    key: 'setMag',
    value: function setMag(mag) {
      // get the magnitude
      var dist = this.len();

      // only if magnitude is non zero
      if (dist > 0) {
        // get the scalar
        var s = mag / dist;

        // scale coordinates
        this.x *= s;
        this.y *= s;
      }
      return this;
    }

    /**
     * Creates a new Vector without having to use the 'new' keyword
     * @param {number} x The x coordinate
     * @param {number} y The y coordinate
     * @static
     */

  }], [{
    key: 'create',
    value: function create(x, y) {
      return new Vector(x, y);
    }

    /**
     * Creates a random Vector uniform withing the unit circle
     * @returns {Vector} The random Vector
     * @static
     */

  }, {
    key: 'random',
    value: function random() {
      // get a random angle
      var angle = _random(0, TWO_PI);

      // convert to cartesian
      var x = Math.cos(angle);
      var y = Math.sin(angle);

      // return calculated Vector
      return Vector.create(x, y);
    }

    /**
     * Creates a new Vector randomly given two angular bounds
     * @param {number} startAngle The minimum angle
     * @param {number} endAngle The maximum angle
     * @returns {Vector} The random Vector
     * @static
     */

  }, {
    key: 'randomFromAngles',
    value: function randomFromAngles(startAngle, endAngle) {
      // get the random angle
      var angle = _random(startAngle, endAngle);

      // convert to cartesian coordinates
      var x = Math.cos(angle);
      var y = Math.sin(angle);

      // return the calculated Vector
      return Vector.create(x, y);
    }

    /**
     * Creates a new Vector sampled uniformly from the given box
     * @param {number} w The width of the box to be sampled from
     * @param {number=} h The height of the box to be sampled from
     * @returns {Vector} The random Vector
     * @static
     */

  }, {
    key: 'randomFromBox',
    value: function randomFromBox(w) {
      var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : w;

      // get random coordinates
      var x = _random(-w, w);
      var y = _random(-h, h);

      // return calculated Vector
      return Vector.create(x, y);
    }
  }]);

  return Vector;
}();
/**
 * Class representing the bounding box, AABB of a Polygon, Circle or Body
 * @class Box
 * @classdesc Used for efficient collision detection
 */


var Box = function () {
  /**
   * Creates a Box
   * @param {Vector} min The upper left constraint
   * @param {Vector} max The lower right constraint
   */
  function Box(min, max) {
    _classCallCheck(this, Box);

    /**
     * The minimum bound
     * @name Box#min
     * @type {Vector}
     * @instance
     */
    this.min = min;
    /**
     * The maximum bound
     * @name Box#max
     * @type {Vector}
     * @instance
     */
    this.max = max;
  }

  /**
   * Converts the Box to a polygon
   * @param {number=} density The resulting density of the returned polygon
   * @return {Polygon} The resulting calculated polygon
   */


  _createClass(Box, [{
    key: 'toPolygon',
    value: function toPolygon() {
      var density = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      // The difference between the maximum
      // and minimum bounds of the object
      var diff = this.max.clone().sub(this.min);

      // The size of the resulting polygon
      // Given as the x value of the difference So that the
      // Resulting polygon will have a dynamic size
      var size = diff.x;

      // Scale the difference down so that the points
      // Can be made with the propper size
      diff.scale(1 / size);

      // Set the points of the resulting polygon
      // Order is (Upper left, Upper right, Down right, Down left)
      var points = [Vector.create(), Vector.create(diff.x), Vector.create(diff.x, diff.y), Vector.create(0, diff.y)];

      // Clone the minimum which will be the center of the new Polygon
      // Avoids having a read-only value that changes the original minimum
      var min = this.min.clone();

      // Return the new Polygon with all the properties
      return Polygon.create(min, points, density, size);
    }

    /**
     * Creates a new Box without having to use the 'new' keyword
     * @param {Vector} min - The upper left constraint
     * @param {Vector} max - The lower right constraint
     * @returns {Box} The new instanceof Box
     * @static
     */

  }], [{
    key: 'create',
    value: function create(min, max) {
      return new Box(min, max);
    }
  }]);

  return Box;
}();
/**
 * Class representing the Circle object, used in the game
 * @class Circle
 * @classdesc Creates a new circle with dynamic properties
 */


var Circle = function () {
  /**
   * Creates a new Circle
   * @param {Vector} pos The position of the circle
   * @param {number} r The radius of the circle
   * @param {number=} density The density of the circle
   */
  function Circle(pos, r) {
    var density = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _classCallCheck(this, Circle);

    /**
     * The center of the Circle
     * @name Circle#pos
     * @type {Vector}
     * @instance
     */
    this.pos = pos;
    /**
     * The radius of the circle
     * @name Circle#r
     * @type {number}
     * @instance
     */
    this.r = r;
    /**
     * The density of the Circle
     * @name Circle#density
     * @type {number}
     * @instance
     */
    this.density = density;

    /**
     * States that the Object is a Circle, used instead of 'instanceof'
     * @name Circle#type
     * @type {number}
     * @default 1
     * @instance
     */
    this.type = TYPE_CIRCLE;

    // Recalc all of the properties
    this.recalc();
  }

  /**
   * Recalcs the Circle
   */


  _createClass(Circle, [{
    key: 'recalc',
    value: function recalc() {
      // Recalc mass and AABB
      this.calcMass();
      this.calcAABB();
    }

    /**
     * Calculates the mass of the Circle
     */

  }, {
    key: 'calcMass',
    value: function calcMass() {
      var r = this.r;

      // get radius squared
      var rSq = Math.pow(r, 2);

      // get mass by PI r^2 multiplied by density
      var mass = PI * rSq * this.density;

      /**
       * The mass of the circle
       * @name Circle#mass
       * @type {number}
       * @instance
       */
      this.mass = mass;
      /**
       * The inverse mass of the circle, stored so less calculations take place
       * @name Circle#invMass
       * @type {number}
       * @instance
       */
      this.invMass = 1 / mass;
    }

    /**
     * Calculates the density of the Circle
     * @param {number} density The density of the Circle
     */

  }, {
    key: 'setDensity',
    value: function setDensity(density) {
      // set the new density
      this.density = density;

      // recalc the mass
      this.calcMass();
    }

    /**
     * Adds to the radius of the Circle
     * @param {number} amount The amount to add to the radius
     */

  }, {
    key: 'addSize',
    value: function addSize(amount) {
      // increase the radius then recalc
      this.r += amount;
      this.recalc();
    }

    /**
     * Sets the size of the Circle
     * @param {number} r The new radius of the circle
     */

  }, {
    key: 'setSize',
    value: function setSize(r) {
      // set the new radius then recalc
      this.r = r;
      this.recalc();
    }

    /**
     * Scales the radius of the Circle
     * @param {number} sc The scalar to scale up by
     */

  }, {
    key: 'scale',
    value: function scale(sc) {
      // scale the radius then recalc
      this.r *= sc;
      this.recalc();
    }

    /**
     * Sets the position of the circle
     * @param {Vector} pos The new position of the Circle
     */

  }, {
    key: 'setPosition',
    value: function setPosition(pos) {
      // set the position then recalc the AABB
      this.pos = pos;
      this.calcAABB();
    }

    /**
     * Moves the Circle by a certain amount
     * @param {Vector} vec The vector to move by
     */

  }, {
    key: 'move',
    value: function move(vec) {
      // add the vel/vec to the position then recalc AABB
      this.pos.add(vec);
      this.calcAABB();
    }

    /**
     * Recalcs the AABB of the Circle
     */

  }, {
    key: 'calcAABB',
    value: function calcAABB() {
      // Shorthand properties
      var pos = this.pos;
      var r = this.r;

      // calculate min and max of new AABB
      var min = pos.clone().sub(r, r);
      var max = pos.clone().add(r, r);

      /**
       * The AABB of the Circle
       * @name Circle#AABB
       * @type {Box}
       * @instance
       */
      this.AABB = Box.create(min, max);
    }

    /**
     * Creates a new Circle without having to use the 'new' keyword
     * @param {Vector} pos The position of the circle
     * @param {number} r The radius of the circle
     * @param {number} density The density of the circle
     * @returns {Circle} The new Circle
     * @static
     */

  }], [{
    key: 'create',
    value: function create(pos, r, density) {
      return new Circle(pos, r, density);
    }
  }]);

  return Circle;
}();
/**
 * Class representing the Polygon object, used in the game
 * @class Polygon
 * @classdesc Creates a new polygon with dynamic properties
 */


var Polygon = function () {
  /**
   * Creates a new Polygon
   * @param {Vector} pos The position of the Polygon
   * @param {Vector[]} points The points for the polygon
   * @param {number=} density The density of the circle
   * @param {number=} size The size of the Polygon
   * @param {number=} angle The initial angle of the Polygon
   */
  function Polygon(pos, points) {
    var density = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var angle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    _classCallCheck(this, Polygon);

    /**
     * The center of the Polygon, initialized as the position
     * @name Polygon#pos
     * @type {Vector}
     * @instance
     */
    this.pos = pos;
    /**
     * The angle of the Polygon measured in radians
     * @name Polygon#angle
     * @type {number}
     * @default 0
     * @instance
     */
    this.angle = 0;
    /**
     * The size of the Polygon / How big it is
     * @name Polygon#size
     * @type {number}
     * @default 1
     * @instance
     */
    this.size = size;
    /**
     * The density of the Polygon
     * @name Polygon#density
     * @type {number}
     * @default 1
     * @instance
     */
    this.density = density;
    /**
     * The type of the Polygon, always equals to the constant
     * @name Polygon#type
     * @type {number}
     * @instance
     * @final
     */
    this.type = TYPE_POLYGON;

    // set the points
    this.setPoints(points);

    // if an angle was inputted then rotate
    if (angle) this.rotate(angle);
  }

  /**
   * Calculates the mass of the Polygon
   */


  _createClass(Polygon, [{
    key: 'calcMass',
    value: function calcMass() {
      // set shorthand variables
      var density = this.density;
      var points = this.calcPoints;
      var len = points.length;

      // Set temporary variables
      var area = 0;
      var point = void 0;
      var next = void 0;
      var sum = void 0;

      // loop through all the points
      for (var i = 0; i < len; i++) {
        point = points[i];
        next = i === len - 1 ? points[0] : points[i + 1];

        // get the area of the region and add it to the total
        sum = point.cross(next);
        area += sum;
      }

      area *= 0.5;
      this.area = area;

      // get mass
      var mass = area * density;

      // set mass properties

      /**
       * The mass of the Polygon
       * @name Polygon#mass
       * @type {number}
       * @instance
       */
      this.mass = mass;
      /**
       * The inverse mass of the Polygon (1 / mass)
       * @name Polygon#invMass
       * @type {number}
       * @instance
       */
      this.invMass = 1 / mass;
    }

    /**
     * Gets the center of the polygon
     * @param {number} area The current area of the Polygon
     * @returns {Vector} the center of the Polygon
     */

  }, {
    key: 'getCenter',
    value: function getCenter(area) {
      // set the scalar which will scale each point
      var scalar = 1 / (6 * area);

      var points = this.calcPoints;
      var len = points.length;

      var center = Vector.create();
      var point = void 0;
      var next = void 0;
      var scal = void 0;

      // loop through all the points
      for (var i = 0; i < len; i++) {
        point = points[i];
        next = i === len - 1 ? points[0] : points[i + 1];

        // get the scalar
        scal = point.cross(next);

        // move the center
        center.x += (point.x + next.x) * scal;
        center.y += (point.y + next.y) * scal;
      }

      center.scale(scalar);

      // return the calculated center
      return center;
    }

    /**
     * Sets the density of the Polygon
     * @param {number} density The density of the Polygon
     */

  }, {
    key: 'setDensity',
    value: function setDensity(density) {
      // set the new density and recalc mass
      this.density = density;
      this.calcMass();
    }

    /**
     * Sets the points of the Polygon
     * @param {Vector[]} points The new points of the Polygon
     */

  }, {
    key: 'setPoints',
    value: function setPoints(points) {
      var len = points.length;

      // reset arrays
      var calcPoints = [];
      var edges = [];
      var normals = [];

      // loop through length
      for (var i = 0; i < len; i++) {
        // add a Vector to each array
        calcPoints.push(Vector.create());
        edges.push(Vector.create());
        normals.push(Vector.create());
      }

      // set points and other properties

      /**
       * The points of the Polygon
       * @name Polygon#points
       * @type {Vector[]}
       * @instance
       */
      this.points = points;
      /**
       * The calculated collision points for the Polygon
       * @name Polygon#calcPoints
       * @type {Vector[]}
       * @instance
       */
      this.calcPoints = calcPoints;
      /**
       * The edges of the Polygon
       * @name Polygon#edges
       * @type {Vector[]}
       * @instance
       */
      this.edges = edges;
      /**
       * The normals of the Polygon
       * @name Polygon#normals
       * @type {Vector[]}
       * @instance
       */
      this.normals = normals;

      // recalculate normals and mass
      this.recalc();
      this.calcMass();

      // get center

      /**
       * The center of the polygon, equivalent to the position, only temporary
       * @name Polygon#center
       * @type {Vector}
       * @instance
       */
      this.center = this.getCenter(this.area);

      // offset points to have the position be the center
      var diff = this.pos.clone().sub(this.center).scale(1 / this.size);
      this.translate(diff.x, diff.y);
    }

    /**
     * Sets the angle of the Polygon
     * @param {number} angle The new angle measured in radians
     */

  }, {
    key: 'setAngle',
    value: function setAngle(angle) {
      // set the angle and recalc
      this.angle = angle;
      this.recalc();
    }

    /**
     * Rotates the Polygon by a given angle
     * @param {number} angle The angle to rotate by measured in radians
     */

  }, {
    key: 'rotate',
    value: function rotate(angle) {
      // increase the angle then recalc
      this.angle += angle;
      this.recalc();
    }

    /**
     * Translates the Polygons original points by an x and y value
     * @param {number} x The x value to translate by
     * @param {number} y The y value to translate by
     */

  }, {
    key: 'translate',
    value: function translate(x, y) {
      // get points
      var points = this.points;

      // loop through points
      for (var i = 0; i < points.length; i++) {
        // translate each point
        points[i].x += x;
        points[i].y += y;
      }

      // recalc normals, etc
      this.recalc();
    }

    /**
     * Handles a change in size
     */

  }, {
    key: 'handleChange',
    value: function handleChange() {
      // recalc mass and normals, etc
      this.calcMass();
      this.recalc();
    }

    /**
     * Scales the polygon by a scalar
     * @param {number} sc The scalar to scale by
     */

  }, {
    key: 'scale',
    value: function scale(sc) {
      // scale the size and recalc everything
      this.size *= sc;
      this.handleChange();
    }

    /**
     * Sets the size of the Polygon
     * @param {number} size The new size
     */

  }, {
    key: 'setSize',
    value: function setSize(size) {
      // change the size and recalc everthing
      this.size = size;
      this.handleChange();
    }

    /**
     * Increases the size of the Polygon
     * @param {number} amount The amount to increase the size by
     */

  }, {
    key: 'addSize',
    value: function addSize(amount) {
      // increase the size and recalc everything
      this.size += amount;
      this.handleChange();
    }

    /**
     * Sets the new Position of the Polygon
     * @param {Vector} pos The new position
     */

  }, {
    key: 'setPosition',
    value: function setPosition(pos) {
      // set the new position and recalc
      this.pos = pos;
      this.recalc();
    }

    /**
     * Moves the Polygon by a certain amount
     * @param {Vector} vec The amount to move by
     */

  }, {
    key: 'move',
    value: function move(vec) {
      this.pos.add(vec);
      this.recalc();
    }

    /**
     * Recalculates the polygons normals and other properties
     */

  }, {
    key: 'recalc',
    value: function recalc() {
      // The points of the Polygon, given in a Vector array
      // Are the original points that will remain unchanged
      // And are only to reference off of and copy into other Vectors
      var points = this.points;

      // The calculated points of the Polygon which are to be used
      // In collision testing and rendering, they include the given
      // angle and size etc. in the calculation
      var calcPoints = this.calcPoints;

      // The angle of the polygon in which the calcPoints will be rotated by
      var angle = this.angle;

      // The edges of the polygon which each are a Vector that represents
      // a single edge which is calculated by subtracting one of the points
      // by another
      var edges = this.edges;

      // The normals of the polygon to be used in collision detection
      // Is a normalized edge of the Polygon
      var normals = this.normals;

      // The size of the polygon which the calcPoints will be scaled by
      var size = this.size;

      // How many points there are
      var len = points.length;

      // set the temp variables
      var tempVector = Vector.create();
      var distance = 0;
      var bestDistance = 0;

      // loop through all the points
      for (var i = 0; i < len; i++) {
        var point = this.points[i];

        // initially set the calcPoint
        var calcPoint = calcPoints[i].copy(point).scale(size);

        // if there is an angle than rotate the point
        if (angle !== 0) calcPoint.rotate(angle);

        // calculate squared distance to center then store it
        // if it is the furthest distance
        distance = tempVector.copy(calcPoint).len2();
        if (distance > bestDistance) bestDistance = distance;

        calcPoint.add(this.pos);
      }

      // set the radius of the polygon as the furthest distance from the center
      this.r = Math.sqrt(bestDistance);

      // loop through all the points
      for (var _i2 = 0; _i2 < len; _i2++) {
        var point1 = calcPoints[_i2];
        var point2 = _i2 < len - 1 ? calcPoints[_i2 + 1] : calcPoints[0];

        // get the edge as the points subtracted from eachother
        var edge = edges[_i2].copy(point2).sub(point1);

        // finally calculate the normal
        normals[_i2].copy(edge).perp().normalize();
      }

      // calculate the AABB of the Polygon
      this.AABB = this.getAABB();
    }

    /**
     * Calculates the AABB of the Polygon
     * @returns {Box} The calculated AABB
     */

  }, {
    key: 'getAABB',
    value: function getAABB() {
      var points = this.calcPoints;

      // initialize the min and max vars
      var xMin = points[0].x;
      var yMin = points[0].y;
      var xMax = points[0].x;
      var yMax = points[0].y;

      // loop through all the points
      for (var i = 0; i < points.length; i++) {
        var point = points[i];

        // if it is less or larger set the x value as min / max
        if (point.x < xMin) {
          xMin = point.x;
        } else if (point.x > xMax) {
          xMax = point.x;
        }

        // if it is less or larger set the y value as min / max
        if (point.y < yMin) {
          yMin = point.y;
        } else if (point.y > yMax) {
          yMax = point.y;
        }
      }

      // get the min and max as a combination of the individual variables
      var min = Vector.create(xMin, yMin);
      var max = Vector.create(xMax, yMax);

      // return the new Box
      return Box.create(min, max);
    }

    /**
     * Creates a new Polygon without having to use the 'new' keyword
     * @param {Vector} pos The position of the Polygon
     * @param {Vector[]} points The points for the polygon
     * @param {number=} density The density of the circle
     * @param {number=} size The size of the Polygon
     * @param {number=} angle The initial angle of the Polygon
     * @returns {Polygon} The new Polygon
     * @static
     */

  }], [{
    key: 'create',
    value: function create(pos, points, density, size, angle) {
      return new Polygon(pos, points, density, size, angle);
    }
  }]);

  return Polygon;
}();
/**
 * @prop {Vector[]} RegularPolygonPoints The array to be referenced for the Regular Polygons points
 * @global
 * @final
 */


var RegularPolygonPoints = function (amount) {
  /**
   * A function to generate Regular Polygon Points given a number of points
   * @param {number} numberSides The number of sides
   * @returns {Vector[]} The calculated points
   * @private
   * @function
   */
  var _generatePolygonPoints = function _generatePolygonPoints(numberSides) {
    // get the difference to add in angle
    var da = TWO_PI / numberSides;

    var points = [];
    var v = void 0;
    var x = void 0;
    var y = void 0;

    // for each angle:
    for (var a = 0; a < TWO_PI; a += da) {
      // use polar conversion to cartesian for x, y values
      x = Math.cos(a);
      y = Math.sin(a);

      // get the vector and add to points
      v = Vector.create(x, y);
      points.push(v);
    }
    return points;
  };

  // constant array for polygons points
  var array = [];
  var points = void 0;

  // loop through untill the amount specified and fill
  // that array spot with generated points
  for (var i = 3; i < amount; i++) {
    points = _generatePolygonPoints(i);
    array[i] = points;
  }

  return array;
}(50);

/**
 * Class representing the RegularPolygon object, used in the game
 * @class RegularPolygon
 * @classdesc Creates a new RegularPolygon and returns a normal Polygon
 */

var RegularPolygon = function () {
  /**
   * Creates a RegularPolygon
   * @param {Vector} pos The position of the Polygon
   * @param {number} numberSides The number of sides
   * @param {number=} density The density of the circle
   * @param {number=} size The size of the Polygon
   * @param {number=} angle The initial angle of the Polygon
   * @return {Polygon} The calculated polygon
   */
  function RegularPolygon(pos) {
    var numberSides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
    var density = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var angle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    _classCallCheck(this, RegularPolygon);

    // get the points
    var vertices = RegularPolygonPoints[numberSides];
    var points = cloneVectorArray(vertices);

    // return the polygon
    return Polygon.create(pos, points, density, size, angle);
  }

  /**
   * Creates a RegularPolygon without having to use the new keyword
   * @param {Vector} p The position of the Polygon
   * @param {number} n The number of sides
   * @param {number=} d The density of the circle
   * @param {number=} s The size of the Polygon
   * @param {number=} a The initial angle of the Polygon
   * @returns {Polygon} The calculated polygon
   * @static
   */


  _createClass(RegularPolygon, null, [{
    key: 'create',
    value: function create(p, n, d, s, a) {
      return new RegularPolygon(p, n, d, s, a);
    }
  }]);

  return RegularPolygon;
}();
/**
 * Class representing the Body object, used in the game
 * @class Body
 * @classdesc Holds information for an object including collision data, etc
 */


var Body = function () {
  /**
   * Creates a new Body
   * @param {Circle|Polygon} shape The shape to be used
   */
  function Body(shape) {
    _classCallCheck(this, Body);

    /**
     * The hitbox or shape of the Body
     * @name Body#shape
     * @type {Circle|Polygon}
     * @instance
     */
    this.shape = shape;

    /**
     * The velocity of the Body
     * @name Body#vel
     * @type {Vector}
     * @instance
     */
    this.vel = Vector.create();
    /**
     * The acceleration of the Body
     * @name Body#acc
     * @type {Vector}
     * @instance
     */
    this.acc = Vector.create();
    /**
     * A temporary Vector to avoid allocating memory
     * @name Body#tempVector
     * @type {Vector}
     * @instance
     */
    this.tempVector = Vector.create();

    /**
     * The last 5 or so angles of the Body that are stored
     * So that the rotations are smooth
     * @name Body#angles
     * @type {number[]}
     * @instance
     */
    this.angles = [];
    /**
     * The angular Velocity of the Body
     * @name Body#angVel
     * @type {number}
     * @default 0
     * @instance
     */
    this.angVel = 0;
    /**
     * The times left before the Body can stop rotation
     * So that the rotation is smooth and not sudden
     * @name Body#angCount
     * @type {number}
     * @instance
     */
    this.angCount = 0;
    /**
     * The permanent rotation that the Body will rotate by
     * @name Body#permanentRotation
     * @type {number}
     * @default 0
     * @instance
     */
    this.permanentRotation = 0;

    /**
     * Whether the Body is oscilating
     * @name Body#oscilating
     * @type {boolean}
     * @default false
     * @instance
     */
    this.oscilating = false;
    /**
     * The last few sizes of the Body so that it can oscilate legitamately
     * @name Body#oscilationMemory
     * @type {number[]}
     * @instance
     */
    this.oscilationMemory = [];
    /**
     * How much the Body will be oscilating ie the strength
     * @name Body#oscilationStrength
     * @type {number}
     * @default 0
     * @instance
     */
    this.oscilationStrength = 0;
    /**
     * The counter for ticking past the sin or cosin wave during oscilation
     * @name Body#oscilationCount
     * @type {number}
     * @default 0
     * @instance
     */
    this.oscilationCount = 0;
    /**
     * The minimum size that the Polygon can be while oscilating
     * @name Body#minOscilationSize
     * @type {number}
     * @default 0
     * @instance
     */
    this.minOscilationSize = 0;
    /**
     * How fast the Body is oscilating
     * @name Body#oscilationSpeed
     * @type {number}
     * @default 0
     * @instance
     */
    this.oscilationSpeed = 0;

    /**
     * Whether the Body is involved in a collision
     * @name Body#inCollision
     * @type {boolean}
     * @instance
     */
    this.inCollision = false;
    /**
     * The bounce when the Body is involved in a collision
     * @name Body#restitution
     * @type {number}
     * @default 0
     * @instance
     */
    this.restitution = 0;
    /**
     * Whether the Body is shrinking or not
     * @name Body#shrinking
     * @type {boolean}
     * @default false
     * @instance
     */
    this.shrinking = false;
    /**
     * How fast the Body is shrinking, the lower the faster
     * @name Body#shrinkSpeed
     * @type {number}
     * @default 0.95
     * @instance
     */
    this.shrinkSpeed = 0.95;
    /**
     * How many frames left before the Body shrinks
     * @name Body#lifespan
     * @type {boolean|number}
     * @default false
     * @instance
     */
    this.lifespan = false;
  }

  /**
   * Starts oscilating the Body, as in making it smaller and bigger
   * In a wave like motion due to the given inputs
   * @param {number=} strength How large or small it gets, the higher the srength the
   *   larger the difference between the highest and smallest sized during oscilation
   * @param {number=} speed How fast the Body will oscilate
   * @param {number=} min The minimum size while oscilating
   */


  _createClass(Body, [{
    key: 'oscilate',
    value: function oscilate() {
      var strength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.01;

      // set oscilation to true and update settings
      this.oscilating = true;
      this.oscilationCount = 0;
      this.oscilationStrength = strength;
      this.minOscilationSize = min;

      // scale down speed so numbers like 5 will equal a small oscilation speed
      this.oscilationSpeed = speed * 0.01;
    }

    /**
     * Applies a force to the Body, equivalently moving it in
     * a dirrection where the magnitude is affected by the mass
     * @param {Vector} force A Vector where the Body should be pushed
     */

  }, {
    key: 'applyForce',
    value: function applyForce(force) {
      var div = this.shape.invMass;
      var f = this.tempVector.copy(force).scale(div);

      // finally add the scaled force to the accelaration
      this.acc.add(f);
    }

    /**
     * Sets the velocity of the Body
     * @param {Vector=} vel The velocity to set
     */

  }, {
    key: 'setVel',
    value: function setVel() {
      var vel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Vector.create();

      this.vel = vel;
    }

    /**
     * Rotates the body by the given angle in radians
     * @param {number} angle The angle to rotate by
     */

  }, {
    key: 'rotate',
    value: function rotate(angle) {
      // cut up the turn into smaller steps so it doesnt look jumpy
      this.angVel = angle * 0.1;
      this.angCount = 10;
    }

    /**
     * Updates the shrinking motion of the Body effectively making it smaller
     */

  }, {
    key: 'shrink',
    value: function shrink() {
      this.shrinking = true;

      // scale the size by the shrinkspeed of the Body
      this.shape.scale(this.shrinkSpeed);
    }

    /**
     * Decides whether the Body size is big enough to exist
     * @returns {boolean} Whether the Body exists
     */

  }, {
    key: 'exists',
    value: function exists() {
      var type = this.shape.type;
      if (type === TYPE_POLYGON) return this.shape.size > 0.01;
      if (type === TYPE_CIRCLE) return this.shape.r > 0.01;
    }

    /**
     * Applies the given def to the body, changing its inner settings
     * @param {Def=} def The def to be applied against the Body
     * @param {Vector=} def.vel The velocity to be set
     * @param {number=} def.angle The initial angle to be set against the shaoe
     * @param {number=} def.rotate The permanent rotation
     * @param {boolean=} def.oscilate Whether the Body will oscilate
     * @param {number=} def.oscilationStrength The range of oscilation sizes
     * @param {number=} def.oscilationSpeed How fast the Body oscilates
     * @param {number=} def.minOscilationSize The minimum size during oscilation
     * @param {number=} def.lifespan How many game ticks are left till the Body shrinks
     * @param {number=} def.shrinkSpeed How fast the Body shrinks
     * @param {string|RGBA=} def.fillColor The fill color of the Body
     * @param {string|RGBA=} def.strokeColor The stroke color of the body
     * @param {number=} def.strokeWidth The width of the stroked line when drawing the Body
     * @param {number=} def.restitution The bounce factor during collisions
     */

  }, {
    key: 'applyDef',
    value: function applyDef() {
      var def = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Def.create();

      // set default values
      var vel = def.vel,
          angle = def.angle,
          rotate = def.rotate,
          oscilate = def.oscilate,
          oscilationStrength = def.oscilationStrength,
          oscilationSpeed = def.oscilationSpeed,
          minOscilationSize = def.minOscilationSize,
          lifespan = def.lifespan,
          shrinkSpeed = def.shrinkSpeed,
          fillColor = def.fillColor,
          strokeColor = def.strokeColor,
          strokeWidth = def.strokeWidth,
          restitution = def.restitution;

      // if there is a velocity then set the velocity

      if (vel) this.setVel(vel);

      // if there is an angle then rotate by that amount
      if (angle) this.shape.setAngle(angle);
      if (rotate) this.permanentRotation = rotate;

      // if oscilation is there than oscilate by the parameters given
      if (oscilate) {
        var strength = oscilationStrength;
        var speed = oscilationSpeed;
        var min = minOscilationSize;
        this.oscilate(strength, speed, min);
      }

      // if there was a lifespan specified then set lifespan and or shrinkspeed
      if (lifespan) this.lifespan = lifespan;
      if (shrinkSpeed) this.shrinkSpeed = shrinkSpeed;

      // set colors
      this.fillColor = fillColor;
      this.strokeColor = strokeColor;

      // some un-processable value for no strokeColor
      this.strokeWidth = strokeWidth || 0.01;

      // if there is no restitution then it will be the Def default value
      this.restitution = restitution;
    }

    /**
     * Updates the angles in the angular memory,
     * Aimed at creating a delayed turn
     * @param {boolean} doRotate whether the Body should rotate
     */

  }, {
    key: 'updateAngularMemory',
    value: function updateAngularMemory(doRotate) {
      var shape = this.shape;

      // only rotate if it is a polygon and the doRotate param is true
      if (shape.type === TYPE_POLYGON) {
        if (doRotate) {
          // get current angles
          var angles = this.angles;

          // get current angle
          var _angle = this.vel.getAngle();
          var currentAngle = angles.length < 5 ? _angle : angles.shift();

          // push current angle
          angles.push(_angle);

          // set angle of shape
          this.shape.setAngle(currentAngle);
        }

        // rotate by permanent rotation
        var angle = this.permanentRotation;
        if (angle) this.shape.rotate(angle);
      }
    }

    /**
     * Updates the oscilation of the Body
     */

  }, {
    key: 'updateOscilation',
    value: function updateOscilation() {
      // only if it is oscilating and not shrinking
      if (this.oscilating && !this.shrinking) {
        // update the oscilation count
        this.oscilationCount++;

        // def default variables
        var oscilationMemory = this.oscilationMemory,
            oscilationCount = this.oscilationCount,
            oscilationSpeed = this.oscilationSpeed,
            oscilationStrength = this.oscilationStrength,
            minOscilationSize = this.minOscilationSize,
            shape = this.shape;
        var r = shape.r,
            size = shape.size,
            type = shape.type;

        // get the current angle and sin value

        var theta = oscilationCount * oscilationSpeed;
        var sin = Math.sin(theta);

        // get last and current size
        var prevSize = oscilationMemory[0] || 0;
        var newSize = sin * oscilationStrength;

        // update oscilation memory
        oscilationMemory[0] = oscilationMemory[1] || 0;
        oscilationMemory[1] = newSize;

        // get difference between sizes and the current size
        var diff = newSize - prevSize;
        var radius = type === TYPE_CIRCLE ? r : size;

        // calculate the new size and change the shapes size to that
        var total = abs(diff + radius);
        var Size = constrain(total, minOscilationSize, Math.MAX_VALUE);

        this.shape.setSize(Size);
      }
    }

    /**
     * Updates the Polygon including angular rotation, velocity etc
     * @param {boolean} noRotate whether the Polygon should not have its rotation updated
     */

  }, {
    key: 'update',
    value: function update(noRotate) {
      // integrate velocity
      this.vel.add(this.acc);
      this.shape.move(this.vel);
      this.acc.reset();

      var doRotate = !noRotate;

      // update angles and oscilation
      this.updateAngularMemory(doRotate);
      this.updateOscilation();

      // update angular velocity
      if (this.angCount > 0) {
        this.vel.rotate(this.angVel);
        this.angCount--;

        if (this.angCount === 0) {
          this.angVel = 0;
          this.inCollision = false;
        }
      }

      // update lifespan
      if (this.lifespan) {
        this.lifespan--;

        if (this.lifespan <= 0) {
          this.shrink();
          this.lifespan = false;
        }
      }

      // update shrinking
      if (this.shrinking) {
        this.shrink();
      }
    }

    /**
     * Creates a new Body without having to use the 'new' keyword
     * @param {Polygon|Circle} shape The shape to be passed into the Bodys parameters
     * @returns {Body} The new CirBodycle
     * @static
     */

  }], [{
    key: 'create',
    value: function create(shape) {
      return new Body(shape);
    }
  }]);

  return Body;
}();
/**
 * Class representing Manifold for collision testing
 * @class Manifold
 * @classdesc Stores data for after a collision took place
 */


var Manifold = function () {
  /**
   * Creates a new Manifold
   */
  function Manifold() {
    _classCallCheck(this, Manifold);

    this.reset();
  }

  /**
   * Resets the values of the Manifold
   */


  _createClass(Manifold, [{
    key: 'reset',
    value: function reset() {
      this.normal = Vector.create();
      this.exitV = Vector.create();

      this.penetration = Number.MAX_VALUE;
    }

    /**
     * Creates a new Manifold without having to use the 'new' keyword
     * @returns {Manifold} The calculated Manifold
     * @static
     */

  }], [{
    key: 'create',
    value: function create() {
      return new Manifold();
    }
  }]);

  return Manifold;
}();
/**
 * Class representing the SAT object, used for collision detection
 * @class SAT
 * @classdesc Is a namespace for a collision tester
 */


var SAT = function () {
  /**
   * Creates a new instance of SAT
   */
  function SAT() {
    _classCallCheck(this, SAT);

    /**
     * An array of Vectors to avoid allocating memory
     * @name SAT#TVECS
     * @type {Vector[]}
     * @instance
     */
    this.TVECS = [];

    // fill with 10 Vectors
    for (var i = 0; i < 10; i++) {
      this.TVECS.push(Vector.create());
    }
  }

  /**
   * Gets the minimum and maximum points on an axis
   * @param {Vector[]} points The points to test on
   * @param {Vector} normal The normalized axis
   * @param {number[]} result The array which the values will be stored in
   */


  _createClass(SAT, [{
    key: 'flattenPointsOn',
    value: function flattenPointsOn(points, normal, result) {
      // set min and max as Infinity and -Infinity
      var min = Number.MAX_VALUE;
      var max = -min;

      for (var i = 0; i < points.length; i++) {
        // get the dot and if smaller or larger store it
        var dot = points[i].dot(normal);
        if (dot < min) min = dot;
        if (dot > max) max = dot;
      }

      // store the results
      result[0] = min;
      result[1] = max;
    }

    /**
     * Decides whether an axis separates two sets of points
     * @param {Vector} aPos The position of Polygon A
     * @param {Vector} bPos The position of Polygon B
     * @param {Vector[]} aPoints The points of Polygon A
     * @param {Vector[]} bPoints The points of Polygon B
     * @param {Vector} axis The normalized axis to test on
     * @param {Manifold} manifold The manifold for the result to be outputed
     * @param {boolean=} isCircle Whether Shape B is a circle
     * @param {number=} radius How big the circle is if it is a circle
     * @returns {boolean} Whether there is a separating axis
     */

  }, {
    key: 'isSeparatingAxis',
    value: function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, manifold, isCircle, radius) {
      // init ranges
      var rangeA = [0, 0];
      var rangeB = [0, 0];

      // get min and max
      this.flattenPointsOn(aPoints, axis, rangeA);
      this.flattenPointsOn(bPoints, axis, rangeB);

      // deal with whether it is a circle
      if (isCircle) {
        rangeB[0] -= radius;
        rangeB[1] += radius;
      }

      // set shorthand vars
      var minA = rangeA[0],
          maxA = rangeA[1];
      var minB = rangeB[0],
          maxB = rangeB[1];

      // early escape

      if (minA > maxB || minB > maxA) return true;

      // init vars
      var overlap = 0;
      var option1 = void 0;
      var option2 = void 0;

      // calculate overlap based off of a tree of options
      if (minA < minB) {
        if (maxA < maxB) {
          overlap = maxA - minB;
        } else {
          option1 = maxA - minB;
          option2 = maxB - minA;
          overlap = option1 < option2 ? option1 : -option2;
        }
      } else {
        if (maxA > maxB) {
          overlap = minA - maxB;
        } else {
          option1 = maxA - minB;
          option2 = maxB - minA;
          overlap = option1 < option2 ? option1 : -option2;
        }
      }

      // get penetration
      var penetration = abs(overlap);

      // decide if penetration is smaller, then save it
      if (penetration < manifold.penetration) {
        manifold.penetration = penetration;
        manifold.normal.copy(axis);

        // if the overlap is negative reverse the normal
        if (overlap < 0) manifold.normal.reverse();
      }

      // there was no separating axis
      return false;
    }

    /**
     * Decides if two AABBs collide
     * @param {Box} a The first AABB
     * @param {Box} b The second AABB
     * @returns {boolean} Whether they collide
     */

  }, {
    key: 'AABB',
    value: function AABB(a, b) {
      return !(a.min.x > b.max.x || a.max.x < b.min.x || a.min.y > b.max.y || a.max.y < b.min.y);
    }

    /**
     * Decides whether two circles are colliding
     * @param {Circle} a The first Circle
     * @param {Circle} b The second Circle
     * @param {Manifold} manifold The manifold to store the collision data
     * @returns {boolean} Whether the two circles are colliding
     */

  }, {
    key: 'circleCircle',
    value: function circleCircle(a, b, manifold) {
      // get the separation vector and distance
      // as well as total radius
      var distV = this.TVECS.pop().copy(b.pos).sub(a.pos);
      var totalR = a.r + b.r;
      var totalRSq = Math.pow(totalR, 2);
      var distSq = distV.len2();

      this.TVECS.push(distV);

      // if the distance is greater than the radii then
      // they are not colliding
      if (distSq > totalRSq) return false;

      // calculate real distance
      var dist = Math.sqrt(dist2);

      // store collision data
      manifold.penetration = totalR - dist;
      manifold.normal.copy(distV.normalize());
      manifold.exitV.copy(distV).scale(manifold.penetration);

      // they have collided
      return true;
    }

    /**
     * Decides whether a Polygon is colliding with a Circle
     * @param {Polygon} polygon The Polygon
     * @param {Circle} circle The Circle
     * @param {Manifold} manifold The manifold to hold the collision data
     * @returns {boolean} Whether they have collided
     */

  }, {
    key: 'polygonCircle',
    value: function polygonCircle(polygon, circle, manifold) {
      // early escape if AABBs are not touching
      if (!this.AABB(polygon.AABB, circle.AABB)) return false;

      // aliases
      var points = polygon.calcPoints;
      var normals = polygon.normals;
      var len = points.length;
      var pPos = polygon.pos;
      var cPos = circle.pos;
      var r = circle.r;
      var cPoints = [cPos];

      var distSq = 0;
      var axis = this.TVECS.pop();
      var bestAxis = this.TVECS.pop();
      var bestDist = Number.MAX_VALUE;

      // loop through points and get least distance
      for (var i = 0; i < len; i++) {
        axis.copy(cPos).sub(points[i]);
        distSq = axis.len2();

        if (distSq < bestDist) {
          bestDist = distSq;
          bestAxis.copy(axis);
        }
      }

      // normalize the axis
      bestAxis.normalize();

      this.TVECS.push(axis);
      this.TVECS.push(bestAxis);

      // test the centerToClosestPoint axis and if there is early escape
      if (this.isSeparatingAxis(pPos, cPos, points, cPoints, bestAxis, manifold, true, r)) return false;

      // loop through Polygons axis and test against
      for (var _i3 = 0; _i3 < len; _i3++) {
        if (this.isSeparatingAxis(pPos, cPos, points, cPoints, normals[_i3], manifold, true, r)) return false;
      }

      // get data as they have collided
      manifold.exitV.copy(manifold.normal).scale(manifold.penetration * 1.1);
      return true;
    }

    /**
     * Decides whether a Circle is colliding with a Polygon
     * @param {Circle} a The Circle
     * @param {Polygon} b The Polygon
     * @param {Manifold} manifold The manifold to hold the collision data
     * @returns {boolean} Whether they have collided
     */

  }, {
    key: 'circlePolygon',
    value: function circlePolygon(a, b, manifold) {
      var result = this.polygonCircle(b, a, manifold);

      // reverse data and return result
      manifold.normal.reverse();
      manifold.exitV.reverse();
      return result;
    }

    /**
     * Decides whether two polygons are colliding
     * @param {Polygon} a The first Polygon
     * @param {Polygon} b The second Polygon
     * @param {Manifold} manifold The manifold to store the collision data
     * @returns {boolean} Whether they have collided
     */

  }, {
    key: 'polygonPolygon',
    value: function polygonPolygon(a, b, manifold) {
      // early escape if AABBs are not colliding
      if (!this.AABB(a.AABB, b.AABB)) return false;

      // aliases
      var aPoints = a.calcPoints;
      var bPoints = b.calcPoints;
      var aPos = a.pos;
      var bPos = b.pos;
      var aNormals = a.normals;
      var bNormals = b.normals;

      // loop through Polygon a axis and test for separation
      for (var i = 0; i < aPoints.length; i++) {
        if (this.isSeparatingAxis(aPos, bPos, aPoints, bPoints, aNormals[i], manifold)) return false;
      }

      // loop through Polygon b axis and test for separation
      for (var _i4 = 0; _i4 < bPoints.length; _i4++) {
        if (this.isSeparatingAxis(aPos, bPos, aPoints, bPoints, bNormals[_i4], manifold)) return false;
      }

      // they are colliding so calculate escape Vector and return
      manifold.exitV.copy(manifold.normal).scale(manifold.penetration * 1.1);
      return true;
    }

    /**
     * Decides whether two shapes are colliding
     * @param {Polygon|Circle} a The first shape
     * @param {Polygon|Circle} b The second shape
     * @param {Manifold} manifold The object that will hold the collision data
     * @returns {boolean} Whether the two shapes have collided or not
     */

  }, {
    key: 'collision',
    value: function collision(a, b, manifold) {
      // decide which type each one is
      var aIsPolygon = a.type === TYPE_POLYGON;
      var bIsPolygon = b.type === TYPE_POLYGON;

      // go through each possibility and return the result
      if (aIsPolygon) {
        if (bIsPolygon) {
          // A is polygon and B is polygon
          return this.polygonPolygon(a, b, manifold);
        }
        // A is polygon and B is circle
        return this.polygonCircle(a, b, manifold);
      }
      if (bIsPolygon) {
        // A is circle and B is polygon
        return this.circlePolygon(a, b, manifold);
      }
      // A is circle and B is circle
      return this.circleCircle(a, b, manifold);
    }

    /**
     * Solves a collision between two bodies
     * @param {Body} mover The body that will be pushed out of the way and
     *   who will be tested against the other body
     * @param {Body} body The static body that will be tested against
     *   the mover
     * @param {Manifold} manifold The object to hold the collision data
     * @param {boolean=} noRotate Whether the mover can not rotate or can rotate
     * @returns {boolean} Whether they have collided
     */

  }, {
    key: 'solveCollision',
    value: function solveCollision(mover, body, manifold, noRotate) {
      manifold.reset();

      // get relative velovity and position
      var relativeVelocity = this.TVECS.pop().copy(mover.vel).sub(body.vel);
      var relativePosition = this.TVECS.pop().copy(mover.shape.pos).sub(body.shape.pos);

      // decide if they are moving towards eachother
      var dotProduct = relativeVelocity.dot(relativePosition);
      var isMovingTowards = dotProduct < 0;

      this.TVECS.push(relativeVelocity);
      this.TVECS.push(relativePosition);

      // get collision data
      var result = this.collision(mover.shape, body.shape, manifold);

      // only solve collision if they have collided
      if (result) {
        // move the mover out of the path
        mover.shape.pos.sub(manifold.exitV);

        // only if they are moving towards eachother
        // and the mover is not involved in a collision
        if (isMovingTowards && !mover.inCollision) {
          // only if the mover can rotate do the rotation
          if (noRotate) {
            // if cant rotate than just reflect against the normal
            mover.vel.reflectN(manifold.normal.perp());
          } else {
            // get velocity and collision normal
            var vel = this.TVECS.pop().copy(mover.vel);
            var normal = manifold.normal.perp();

            // calculate differences in angles
            var befAngle = vel.getAngle();
            var aftAngle = vel.reflectN(normal).getAngle();

            var angle = aftAngle - befAngle;

            // constrain angles
            if (angle > PI) angle -= TWO_PI;else if (angle < -PI) angle += TWO_PI;

            // update mover data and collision
            mover.vel.scale(mover.restitution);
            mover.rotate(angle);
            mover.inCollision = true;

            this.TVECS.push(vel);
          }
        }

        // they have collided so return true
        return true;
      }

      // they have not collided so return false
      return false;
    }

    /**
     * Creates a new instanceof the SAT class without having to use the 'new' keyword
     * @returns {SAT} The new SAT class
     * @static
     */

  }], [{
    key: 'create',
    value: function create() {
      return new SAT();
    }
  }]);

  return SAT;
}();

(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  var len = vendors.length;
  for (var x = 0; x < len && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
})();
window.addEventListener('load', function () {
  var game = new GameManager();
  game.world.border(6);
  game.restart();

  var fpsOutput = document.getElementById('fpsOutput');

  var fps = 0,
      referenceFrame = 0,
      referenceTime = Date.now();

  game.resize();

  var loop = function loop() {
    referenceFrame++;;
    if (referenceFrame > 10) {
      var currentTime = Date.now(),
          difference = currentTime - referenceTime,
          secondsPassed = difference * 0.001;
      fps = Math.round(referenceFrame / secondsPassed);
      fpsOutput.innerHTML = fps + ' fps';
      referenceTime = Date.now();
      referenceFrame = 0;
    }

    game.resize();
    game.update();
    window.requestAnimationFrame(loop);
  };
  loop();

  window.addEventListener('resize', function () {
    game.resize();
  });
});
