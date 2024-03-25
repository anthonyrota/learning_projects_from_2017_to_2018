import Mesh from './Mesh.js';
import Vec3 from '../math/Vec3.js';

const t = 0.5 + Math.sqrt(5) / 2;

const icosphere = (subdivisions) => {
  let vertices = [
    [-1, +t,  0],
    [+1, +t,  0],
    [-1, -t,  0],
    [+1, -t,  0],
    
    [ 0, -1, +t],
    [ 0, +1, +t],
    [ 0, -1, -t],
    [ 0, +1, -t],
    
    [+t,  0, -1],
    [+t,  0, +1],
    [-t,  0, -1],
    [-t,  0, +1]
  ];
  
  let faces = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
  
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
  
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
  
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1]
  ];

  let mesh = { faces, vertices };

  while (subdivisions-- > 0) {
    mesh = subdivide(mesh);
  }

  vertices = mesh.vertices;
  
  for (let i = 0; i < vertices.length; i++) {
    const p = vertices[i];
    
    const len = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
    
    p[0] /= len;
    p[1] /= len;
    p[2] /= len;
  }

  return mesh;
};

const subdivide = ({ vertices, faces }) => {
  const getMidpoint = (a, b) => {
    const point = midpoint(a, b);
    const pointKey = pointToKey(point);
    const cachedPoint = midpoints[pointKey];
    
    if (cachedPoint) {
      return cachedPoint;
    } else {
      return (midpoints[pointKey] = point);
    }
  };

  const pointToKey = (point) =>
      point[0].toPrecision(6) + ','
    + point[1].toPrecision(6) + ','
    + point[2].toPrecision(6);

  const midpoint = (a, b) => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
    (a[2] + b[2]) / 2
  ];
  
  const newFaces = [];
  const newVertices = [];
  const midpoints = {};
  
  let f = [0, 1, 2];
  let l = 0;

  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
    const c0 = face[0];
    const c1 = face[1];
    const c2 = face[2];
    const v0 = vertices[c0];
    const v1 = vertices[c1];
    const v2 = vertices[c2];

    const a = getMidpoint(v0, v1);
    const b = getMidpoint(v1, v2);
    const c = getMidpoint(v2, v0);

    let ai = newVertices.indexOf(a);
    if (ai === -1) {
      ai = l++;
      newVertices.push(a);
    }
    
    let bi = newVertices.indexOf(b);
    if (bi === -1) {
      bi = l++;
      newVertices.push(b);
    }
    
    let ci = newVertices.indexOf(c);
    if (ci === -1) {
      ci = l++;
      newVertices.push(c);
    }

    let v0i = newVertices.indexOf(v0);
    if (v0i === -1) {
      v0i = l++;
      newVertices.push(v0);
    }
    
    let v1i = newVertices.indexOf(v1);
    if (v1i === -1) {
      v1i = l++;
      newVertices.push(v1);
    }
    
    let v2i = newVertices.indexOf(v2);
    if (v2i === -1) {
      v2i = l++;
      newVertices.push(v2);
    }
    
    newFaces.push.apply(newFaces, [
      [v0i, ai, ci],
      [v1i, bi, ai],
      [v2i, ci, bi],
      [ai, bi, ci]
    ]);
  }

  return {
    faces: newFaces,
    vertices: newVertices
  };
};

export default class SphereMesh extends Mesh {
  constructor(pos, r, precision, color = [128, 128, 128]) {
    const sphere = icosphere(precision);
    const vertices = [];
    const faces = [];
    
    for (let i = 0; i < sphere.vertices.length; i++) {
      const p = sphere.vertices[i];
      
      vertices.push(
        r * p[0] + pos.x,
        r * p[1] + pos.y,
        r * p[2] + pos.z
      );
    }
    
    for (let i = 0; i < sphere.faces.length; i++) {
      faces.push.apply(faces, sphere.faces[i]);
    }
    
    super(vertices, faces, true, color);
  }
}
