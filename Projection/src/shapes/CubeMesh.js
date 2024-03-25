import Vec3 from '../math/Vec3.js';
import Vec4 from '../math/Vec4.js';
import Square from './Square.js';
import BoundingBox from './BoundingBox.js';

const FRONT = 0;
const BACK = 1;
const TOP = 2;
const BOTTOM = 3;
const LEFT = 4;
const RIGHT = 5;

const adjust = 0.005;

export default class CubeMesh {
  constructor(size, position) {
    const min = -adjust;
    const max = size + adjust;
    
    let v = [
      new Vec3(max, max, min).add(position),
      new Vec3(max, min, min).add(position),
      new Vec3(min, min, min).add(position),
      new Vec3(min, max, min).add(position),
      new Vec3(max, max, max).add(position),
      new Vec3(max, min, max).add(position),
      new Vec3(min, min, max).add(position),
      new Vec3(min, max, max).add(position)
    ];
    
    let f = [];
    
    f[FRONT ] = new Square(v[0], v[1], v[2], v[3], true);
    f[BACK  ] = new Square(v[7], v[6], v[5], v[4], true);
    f[TOP   ] = new Square(v[4], v[0], v[3], v[7], true);
    f[BOTTOM] = new Square(v[6], v[2], v[1], v[5], true);
    f[LEFT  ] = new Square(v[3], v[2], v[6], v[7], true);
    f[RIGHT ] = new Square(v[4], v[5], v[1], v[0], true);
  	
  	this.vertices = v;
  	this.faces = f;
  }
  
  disableOverlay() {
    for (let i = 0; i < this.faces.length; i++) {
      this.faces[i].overlayDisabled = true;
    }
  }
  
  enableOverlay() {
    for (let i = 0; i < this.faces.length; i++) {
      this.faces[i].overlayDisabled = false;
    }
  }
  
  setGlobalTexture(texture) {
    for (let i = 0; i < this.faces.length; i++) {
      this.faces[i].setTexture(texture);
    }
  }
  
  setLeftTexture(texture) {
    this.faces[LEFT].setTexture(texture);
  }
  
  setRightTexture(texture) {
    this.faces[RIGHT].setTexture(texture);
  }
  
  setBottomTexture(texture) {
    this.faces[BOTTOM].setTexture(texture);
  }
  
  setFrontTexture(texture) {
    this.faces[FRONT].setTexture(texture);
  }
  
  setTopTexture(texture) {
    this.faces[TOP].setTexture(texture);
  }
  
  setBackTexture(texture) {
    this.faces[BACK].setTexture(texture);
  }
  
  precalc(matrix) {
    for (let i = 0; i < this.faces.length; i++) {
      const f = this.faces[i];
      
      matrix.multiply2d(f.v0, f.w0);
      matrix.multiply2d(f.v1, f.w1);
      matrix.multiply2d(f.v2, f.w2);
      matrix.multiply2d(f.v3, f.w3);
      
      f.w0.x = f.w0.x / f.w0.w;
      f.w0.y = f.w0.y / f.w0.w;
      f.w1.x = f.w1.x / f.w1.w;
      f.w1.y = f.w1.y / f.w1.w;
      f.w2.x = f.w2.x / f.w2.w;
      f.w2.y = f.w2.y / f.w2.w;
      f.w3.x = f.w3.x / f.w3.w;
      f.w3.y = f.w3.y / f.w3.w;
    }
  }
  
  getFaces() {
    return this.faces;
  }
  
  getBoundingBox() {
    return BoundingBox.fromPool(this.vertices);
  }
}
