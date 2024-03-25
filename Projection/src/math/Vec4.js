import Vec3 from './Vec3.js';

export default class Vec4 {
  constructor(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  
  set(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  
  copy(o) {
    this.x = o.x;
    this.y = o.y;
    this.z = o.z;
    this.w = o.w;
  }
  
  toVec3() {
    return new Vec3(
      this.x / this.w,
      this.y / this.w,
      this.z / this.w
    );
  }
}
