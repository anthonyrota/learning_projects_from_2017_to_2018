import Vec3 from '../math/Vec3.js';
import Vec4 from '../math/Vec4.js';

// temporary vectors to avoid
// unnecessary references

const w0 = new Vec4();
const w1 = new Vec4();
const w2 = new Vec4();

const normal = new Vec3();
const temp = new Vec3();
const temp2 = new Vec3();

export default class Triangle {
  constructor(v0, v1, v2, isClockwise, c) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    
    this.w0 = new Vec4();
    this.w1 = new Vec4();
    this.w2 = new Vec4();
    
    this.d = isClockwise;
    this.c = c;
  }
  
  getCenter() {
    const { v0, v1, v2 } = this;
    
    return temp.set(
      (v0.x + v1.x + v2.x) / 3,
      (v0.y + v1.y + v2.y) / 3,
      (v0.z + v1.z + v2.z) / 3
    );
  }
  
  distanceTo(position) {
    return this.getCenter()
      .sub(position)
      .len2();
  }
  
  calcNormal() {
    const { v2, v1, v0 } = this;
    
    return normal
      .copy(v2)
      .sub(v0)
      .cross(
        temp2
          .copy(v1)
          .sub(v0))
      .normalize();
  }
  
  shading(normal, direction) {
    const { v0, v1, v2 } = this;
    
    const distance = temp2.copy(direction).sub(v0).normalize();
    const intensity = normal.dot(distance);
    
    return Math.max(intensity, 0);
  }
  
  render(context, matrix, camera, lightDirection, isWireframe) {
    const { v0, v1, v2, w0, w1, w2, c, d } = this;
    
    if (w0.w < camera.distance.min || w1.w < camera.distance.min || w2.w < camera.distance.min
     || w0.w > camera.distance.max || w1.w > camera.distance.max || w2.w > camera.distance.max) {
      return;
    }
    
    const hw = context.canvas.width / 2;
    const hh = context.canvas.height / 2;
    
    if (!(
      (w0.x > -hw && w0.x < hw) || (w1.x > -hw && w1.x < hw) || (w2.x > -hw && w2.x < hw) ||
      (w0.y > -hh && w0.y < hh) || (w1.y > -hh && w1.y < hh) || (w2.y > -hh && w2.y < hh)
    )) {
      return;
    }
    
    if (isWireframe) {
      context.moveTo(w0.x, w0.y);
      context.lineTo(w1.x, w1.y);
      context.lineTo(w2.x, w2.y);
      context.lineTo(w0.x, w0.y);
      
      return;
    }
    
    const normal = this.calcNormal();
    
    const dot = temp2.copy(camera.position).sub(v0).dot(normal);
    if ((d && dot > 0) || (!d && dot < 0)) {
      return;
    }
    
    const s = 1 - this.shading(normal, lightDirection);
    const color = `rgb(${c[0] * s | 0}, ${c[1] * s | 0}, ${c[2] * s | 0})`;
    
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(w0.x, w0.y);
    context.lineTo(w1.x, w1.y);
    context.lineTo(w2.x, w2.y);
    context.fill();
  }
}
