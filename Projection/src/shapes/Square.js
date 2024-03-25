import Vec3 from '../math/Vec3.js';
import Vec4 from '../math/Vec4.js';
import { SquareProjection } from './TextureProjection.js';

// temporary vectors to avoid
// unnecessary references

const normal = new Vec3();
const temp = new Vec3();
const temp2 = new Vec3();

export default class Square {
  constructor(v0, v1, v2, v3, isClockwise, textureOpts) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
    
    this.w0 = new Vec4();
    this.w1 = new Vec4();
    this.w2 = new Vec4();
    this.w3 = new Vec4();
    
    this.setTexture(textureOpts);
    this.overlayDisabled = false;
    
    this.d = isClockwise;
  }
  
  setTexture(textureOpts = {}) {
    let texture;
    let color;
    
    if (textureOpts instanceof Array) {
      color = textureOpts;
      texture = false;
    } else if (textureOpts instanceof HTMLImageElement
            || textureOpts instanceof HTMLCanvasElement) {
      color = [70, 70, 70];
      texture = textureOpts;
    } else {
      color = textureOpts.color || [70, 70, 70];
      texture = textureOpts.texture || false;
    }
    
    this.color = color || this.color;
    this.texture = texture || this.texture;
  }
  
  getCenter() {
    const { v0, v1, v2, v3 } = this;
    
    return temp.set(
      (v0.x + v1.x + v2.x + v3.x) / 4,
      (v0.y + v1.y + v2.y + v3.y) / 4,
      (v0.z + v1.z + v2.z + v3.z) / 4
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
    
    const distance = temp2.copy(direction).add(this.getCenter()).sub(v0).normalize();
    const intensity = normal.dot(distance);
    
    return Math.max(intensity, 0);
  }
  
  render(context, matrix, camera, lightDirection, isWireframe) {
    const { v0, w0, w1, w2, w3, d } = this;
    
    if (w0.w < camera.distance.min || w1.w < camera.distance.min
     || w2.w < camera.distance.min || w3.w < camera.distance.min
     || w0.w > camera.distance.max || w1.w > camera.distance.max
     || w2.w > camera.distance.max || w3.w > camera.distance.max) {
      return;
    }
    
    const hw = context.canvas.width / 2;
    const hh = context.canvas.height / 2;
    
    if (!((w0.x > -hw && w0.x < hw) || (w1.x > -hw && w1.x < hw)
       || (w2.x > -hw && w2.x < hw) || (w3.x > -hw && w3.x < hw)
       || (w0.y > -hh && w0.y < hh) || (w1.y > -hh && w1.y < hh)
       || (w2.y > -hh && w2.y < hh) || (w3.y > -hh && w3.y < hh))) {
      return;
    }
    
    if (isWireframe) {
      context.moveTo(w0.x, w0.y);
      context.lineTo(w1.x, w1.y);
      context.lineTo(w2.x, w2.y);
      context.lineTo(w3.x, w3.y);
      context.lineTo(w0.x, w0.y);
      
      return;
    }
    
    const texture = this.texture;
    
    if (texture) {
      SquareProjection.renderTexture(
        context, texture, w0, w1, w2, w3);
    }
    
    if (!this.overlayDisabled) {
      const normal = this.calcNormal();
      
      const dot = temp2.copy(camera.position).sub(v0).dot(normal);
      if ((d && dot > 0) || (!d && dot < 0)) {
        return;
      }
      
      const s = 1 - this.shading(normal, lightDirection);
      const c = this.color;
      const color = `rgb(
        ${c[0] * s | 0},
        ${c[1] * s | 0},
        ${c[2] * s | 0}
      )`;
      
      if (this.texture) {
        context.save();
        context.globalAlpha = 0.4;
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(w0.x, w0.y);
        context.lineTo(w1.x, w1.y);
        context.lineTo(w2.x, w2.y);
        context.lineTo(w3.x, w3.y);
        context.fill();
        context.restore();
      } else {
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(w0.x, w0.y);
        context.lineTo(w1.x, w1.y);
        context.lineTo(w2.x, w2.y);
        context.lineTo(w3.x, w3.y);
        context.fill();
      }
    }
  }
}
