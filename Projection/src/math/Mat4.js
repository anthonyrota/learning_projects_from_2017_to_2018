import Vec3 from './Vec3.js';
import Vec4 from './Vec4.js';

export default class Mat4 {
  constructor(m = [1, 0, 0, 0, 0, 1, 0, 0,  0, 0, 1, 0, 0, 0, 0, 1]) {
    this.m = m;
  }
  
  set(m) {
    this.m = m;
  }
  
  multiply(other, r) {
    if (other instanceof Vec3) {
      return this.multVec3(other, r);
    } else {
      return this.multMat(other);
    }
  }
  
  multMat(mat) {
    const [
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      a30, a31, a32, a33
    ] = this.m;
    
    const [
      b00, b01, b02, b03,
      b10, b11, b12, b13,
      b20, b21, b22, b23,
      b30, b31, b32, b33
    ] = mat.m;
    
    const m = this.m;
    
    m[0]  = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
    m[1]  = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
    m[2]  = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
    m[3]  = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
    m[4]  = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
    m[5]  = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
    m[6]  = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
    m[7]  = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
    m[8]  = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
    m[9]  = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
    m[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
    m[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
    m[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
    m[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
    m[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
    m[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
    
    return this;
  }
  
  multVec3(v, o = new Vec4()) {
    const m = this.m;
    
    o.set(
      m[0] * v.x + m[1] * v.y + m[2] * v.z + m[3],
      m[4] * v.x + m[5] * v.y + m[6] * v.z + m[7],
      m[8] * v.x + m[9] * v.y + m[10] * v.z + m[11],
      m[12] * v.x + m[13] * v.y + m[14] * v.z + m[15]
    );
    
    return o;
  }
  
  multiply2d(v, o = new Vec4()) {
    const m = this.m;
    
    o.x = m[0] * v.x + m[1] * v.y + m[2] * v.z + m[3];
    o.y = m[4] * v.x + m[5] * v.y + m[6] * v.z + m[7];
    o.w = m[12] * v.x + m[13] * v.y + m[14] * v.z + m[15];
    
    return o;
  }
  
  static multiply(...matrices) {
    let result = Mat4.identity();
    
    for (let i = 0; i < matrices.length; i++) {
      result.multiply(matrices[i]);
    }
    
    return result;
  }
  
  static identity() {
    return new Mat4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }
  
  static zoom(s) {
    return new Mat4([
      s, 0, 0, 0,
      0, s, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }
  
  static perspective(fov, aspect, n, f) {
    const scale = Math.tan(fov * Math.PI / 180) * n;
    const r = scale * aspect;
    const t = scale;
    
    return Mat4.frustum(-t, t, -r, r, n, f);
  }
  
  static frustum(l, r, b, t, n, f) {
    const result = Mat4.identity();
    const m = result.m;
    
    m[0] = 2 * n / (r - l);
    m[1] = 0;
    m[2] = (r + l) / (r - l);
    m[3] = 0;
  
    m[4] = 0;
    m[5] = 2 * n / (t - b);
    m[6] = (t + b) / (t - b);
    m[7] = 0;
  
    m[8] = 0;
    m[9] = 0;
    m[10] = -(f + n) / (f - n);
    m[11] = -2 * f * n / (f - n);
  
    m[12] = 0;
    m[13] = 0;
    m[14] = -1;
    m[15] = 0;
  
    return result;
  }
  
  static lookAt(e, c, u) {
    const result = Mat4.identity();
    const m = result.m;
  
    const f = e.clone().sub(c).normalize();
    const s = u.clone().cross(f).normalize();
    const t = f.clone().cross(s).normalize();
  
    m[0] = s.x;
    m[1] = s.y;
    m[2] = s.z;
    m[3] = -s.dot(e);
  
    m[4] = t.x;
    m[5] = t.y;
    m[6] = t.z;
    m[7] = -t.dot(e);
  
    m[8] = f.x;
    m[9] = f.y;
    m[10] = f.z;
    m[11] = -f.dot(e);
  
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
  
    return result;
  }
  
  static translate(x, y, z) {
    const result = Mat4.identity();
    const m = result.m;
  
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = x;
  
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = y;
  
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = z;
  
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
  
    return result;
  }
  
  static rotationX(angle) {
    const a = Math.cos(angle * Math.PI / 180);
    const b = Math.sin(angle * Math.PI / 180);
    
    return new Mat4([
      1, 0,  0, 0,
      0, a, -b, 0,
      0, b,  a, 0,
      0, 0,  0, 1,
    ]);
  }
  
  static rotationY(angle) {
    const a = Math.cos(angle * Math.PI / 180);
    const b = Math.sin(angle * Math.PI / 180);
    
    return new Mat4([
       a, 0, b, 0,
       0, 1, 0, 0,
      -b, 0, a, 0,
       0, 0, 0, 1
    ]);
  }
  
  static rotationZ(angle) {
    const a = Math.cos(angle * Math.PI / 180);
    const b = Math.sin(angle * Math.PI / 180);
    
    return new Mat4([
      a, -b, 0, 0,
      b,  a, 0, 0,
      0,  0, 1, 0,
      0,  0, 0, 1
    ]);
  }
  
  static rotation(x, y, z) {
    return Mat4.rotationY(y)
     .multiply(Mat4.rotationX(x))
     .multiply(Mat4.rotationZ(z));
  }
}
