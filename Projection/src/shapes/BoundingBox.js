import Vec3 from '../math/Vec3.js';

export default class BoundingBox {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }
  
  toArray() {
    return [
      this.min.toArray(),
      this.max.toArray()
    ];
  }

  collides(other) {
    const a = this;
    const b = other;

    return (a.min.x < b.max.x && a.max.x > b.min.x) &&
           (a.min.y < b.max.y && a.max.y > b.min.y) &&
           (a.min.z < b.max.z && a.max.z > b.min.z);
  }

  translationVector(other) {
    const a = this;
    const b = other;

    const x1 = b.max.x - a.min.x;
    const x2 = b.min.x - a.max.x;
    const x = x1 > -x2 ? -x2 : -x1;

    const y1 = b.max.y - a.min.y;
    const y2 = b.min.y - a.max.y;
    const y = y1 > -y2 ? -y2 : -y1;

    const z1 = b.max.z - a.min.z;
    const z2 = b.min.z - a.max.z;
    const z = z1 > -z2 ? -z2 : -z1;
    
    const bias = 3;

    const absX = Math.abs(x);
    const absY = Math.abs(y) / bias;
    const absZ = Math.abs(z);

    return absX < absY && absX < absZ
      ? new Vec3(x, 0, 0)
      : absY < absZ
        ? new Vec3(0, y, 0)
        : new Vec3(0, 0, z);
  }

  static fromPool(points) {
    const min = new Vec3(Infinity, Infinity, Infinity);
    const max = new Vec3(-Infinity, -Infinity, -Infinity);
    
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      
      if (p.x < min.x) {
        min.x = p.x;
      } else if (p.x > max.x) {
        max.x = p.x;
      }
      
      if (p.y < min.y) {
        min.y = p.y;
      } else if (p.y > max.y) {
        max.y = p.y;
      }
      
      if (p.z < min.z) {
        min.z = p.z;
      } else if (p.z > max.z) {
        max.z = p.z;
      }
    }

    return new BoundingBox(min, max);
  }
}
