export default class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  set(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  
  toArray() {
    return [this.x, this.y, this.z];
  }
  
  floor(s) {
    if (!s) {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      this.z = Math.floor(this.z);
    } else {
      this.x = Math.floor(this.x / s) * s;
      this.y = Math.floor(this.y / s) * s;
      this.z = Math.floor(this.z / s) * s;
    }
    
    return this;
  }
  
  copy(o) {
    this.x = o.x;
    this.y = o.y;
    this.z = o.z;
    return this;
  }
  
  clone() {
    return new Vec3(this.x, this.y, this.z);
  }
  
  reverse() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }
  
  div(s) {
    this.x /= s;
    this.y /= s;
    this.z /= s;
    return this;
  }
  
  scale(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }
  
  add(o) {
    this.x += o.x;
    this.y += o.y;
    this.z += o.z;
    return this;
  }
  
  sub(o) {
    this.x -= o.x;
    this.y -= o.y;
    this.z -= o.z;
    return this;
  }
  
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  
  limit(len) {
    const selfLen = this.len2();
    
    if (selfLen > len * len) {
      this.scale(len / Math.sqrt(selfLen));
    }
    
    return this;
  }
  
  cross(v) {
    const { x, y, z } = this;
    
    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;
    
    return this;
  }
  
  len2() {
    return this.dot(this);
  }
  
  len() {
    return Math.sqrt(this.dot(this));
  }
  
  normalize() {
    return this.div(this.len());
  }
  
  rotateX(a) {
    const sin = Math.sin(a * Math.PI / 180);
    const cos = Math.cos(a * Math.PI / 180);
    const { y, z } = this;
    
    this.y = cos * y - sin * z;
    this.z = sin * y + cos * z;
    return this;
  }
  
  rotateY(a) {
    const sin = Math.sin(a * Math.PI / 180);
    const cos = Math.cos(a * Math.PI / 180);
    const { x, z } = this;
    
    this.x = cos * x + sin * z;
    this.z = cos * z - sin * x;
    return this;
  }
  
  rotateXY(x, y) {
    return this.rotateY(y).rotateX(x);
  }
  
  static randomBox() {
    return new Vec3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    );
  }
  
  static fromRotation(x, y, r = 1) {
    if (x instanceof Array) {
      y && (r = y);
      [ x, y ] = x;
    }
    
    return new Vec3(0, 0, 1).rotateXY(x, y);
    
    // if (x instanceof Array) {
    //   y && (r = y);
    //   y = x[1];
    //   x = x[0];
    // }
    
    // const sinX = Math.sin(x / 180 * Math.PI);
    // const cosX = Math.cos(x / 180 * Math.PI);
    // const sinY = Math.sin(y / 180 * Math.PI);
    // const cosY = Math.cos(y / 180 * Math.PI);
    
    // return new Vec3(
    //   r * sinX * cosY,
    //   r * sinX * sinY,
    //   r * cosX
    // );
  }
}
