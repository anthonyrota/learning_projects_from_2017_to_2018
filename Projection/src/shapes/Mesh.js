import Vec3 from '../math/Vec3.js';
import Vec4 from '../math/Vec4.js';
import Triangle from './Triangle.js';
import BoundingBox from './BoundingBox.js';

export default class Mesh {
  constructor(vertices, faces, clockwise = true, color = [128, 128, 128]) {
    let verts = [];
  
    if (typeof vertices[0] === 'number') {
      for (let i = 0; i < vertices.length; i += 3) {
        verts.push(new Vec3(
          vertices[i],
          vertices[i + 1],
          vertices[i + 2]
        ));
      }
    } else {
      verts = vertices;
    }
    
    this.vertices = verts;
    this.faces = [];
    
    for (let i = 0; i < faces.length; i += 3) {
      this.faces.push(new Triangle(
        verts[faces[i]],
        verts[faces[i + 1]],
        verts[faces[i + 2]],
        clockwise,
        color
      ));
    }
  }
  
  precalc(matrix) {
    for (let i = 0; i < this.faces.length; i++) {
      const f = this.faces[i];
      
      matrix.multiply2d(f.v0, f.w0);
      matrix.multiply2d(f.v1, f.w1);
      matrix.multiply2d(f.v2, f.w2);
      
      f.w0.x = f.w0.x / f.w0.w;
      f.w0.y = f.w0.y / f.w0.w;
      f.w1.x = f.w1.x / f.w1.w;
      f.w1.y = f.w1.y / f.w1.w;
      f.w2.x = f.w2.x / f.w2.w;
      f.w2.y = f.w2.y / f.w2.w;
    }
  }
  
  setGlobalTexture() {
    
  }
  
  getFaces() {
    return this.faces;
  }
  
  getBoundingBox() {
    return BoundingBox.fromPool(this.vertices);
  }
}
