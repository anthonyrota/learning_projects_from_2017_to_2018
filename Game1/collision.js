function Vector(x,y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.prototype.copy = function() {
  return new Vector(this.x,this.y);
};

Vector.prototype.clone = function(other) {
  this.x = other.x;
  this.y = other.y;
  return this;
};

Vector.prototype.perp = function() {
  var tempx = this.x;
  this.x = this.y;
  this.y = -tempx;
  return this;
};

Vector.prototype.add = function(other) {
  this.x += other.x;
  this.y += other.y;
  return this;
};

Vector.prototype.sub = function(other) {
  this.x -= other.x;
  this.y -= other.y;
  return this;
};

Vector.prototype.scale = function(x,y) {
  this.x *= x;
  this.y *= y || x;
  return this;
};

Vector.prototype.reverse = function() {
  this.x = -this.x;
  this.y = -this.y;
  return this;
};