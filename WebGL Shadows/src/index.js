import { Entity } from './core/entity.js';
import { Scene } from './core/scene.js';
import { MainShader } from './view/shaders/main-shader.js';
import { ShadowShader } from './view/shaders/shadow-shader.js';
import { PlayerCamera } from './view/cameras/player-camera.js';
import { getVertexNormals } from './math/normals.js';
import { DirectionalLight } from './view/directional-light.js';

import * as BUNNY from '../bunny.js';
import PLANE from './models/airplane/airplane.json.js';

const bunny = { vertices: BUNNY.vertices, faces: BUNNY.faces };
const plane = PLANE.meshes[0];

const flatten = array => {
  const res = [];
  for (let i = 0; i < array.length; i++) {
    res.push.apply(res, array[i]);
  }
  return res;
};

const unflatten = array => {
  const res = [];
  for (let i = 0; i < array.length; i += 3) {
    res.push([array[i], array[i + 1], array[i + 2]]);
  }
  return res;
};

bunny.normals = flatten(getVertexNormals(bunny.faces, bunny.vertices));
bunny.faces = flatten(bunny.faces);
bunny.vertices = flatten(bunny.vertices);
bunny.colors = Array(bunny.vertices.length);

for (let i = 0; i < bunny.colors.length; i += 3) {
  bunny.colors[i    ] = 0.9;
  bunny.colors[i + 1] = 0.4;
  bunny.colors[i + 2] = 0.2;
}

const scene = new Scene('canvas');

const canvas = scene.getCanvas();
const gl = scene.getCanvasGl();
const width = window.innerWidth;
const height = window.innerHeight;
const clippingPlanes = vec2.fromValues(0.1, 255);

scene.setAmbientColor(vec3.fromValues(0.25, 0.25, 0.25));
scene.setDirectionalLight(new DirectionalLight({
  direction: vec3.fromValues(-0.7, 0.3, 1),
  color: vec3.fromValues(0.7, 0.7, 0.7),
  maxDistance: 50
}));

const camera = new PlayerCamera(canvas, 45, width / height, ...clippingPlanes);
scene.setCamera(camera);

const shadowShader = new ShadowShader({
  gl,
  shadowClipNearFar: clippingPlanes,
  shadowDepthTextureSize: 1024
});
const mainShader = new MainShader({
  gl,
  shadowClipNearFar: clippingPlanes,
  shadowDepthTextureSize: 1024,
  shadowDepthTexture: shadowShader.depthTexture
});

const planeColor = [1, 0.95, 0.89];

// scene.add(new Entity({ geometry: bunny }));
scene.add(new Entity({
  geometry: {
    colors: Array.from({ length: plane.faces.length * 3 }, (_, i) => planeColor[i % 3]),
    vertices: plane.vertices.map(x => x * 0.5),
    normals: flatten(getVertexNormals(plane.faces, unflatten(plane.vertices))), //plane.normals,
    faces: flatten(plane.faces)
  },
  rotation: vec3.fromValues(Math.PI * -0.5, Math.PI, 0),
  position: vec3.fromValues(0, 0, 10)
}));

scene.add(new Entity({
  geometry: {
    colors: [
      0.4, 0.4, 0.4,
      0.4, 0.4, 0.4,
      0.4, 0.4, 0.4,
      0.4, 0.4, 0.4
    ],
    vertices: [
      -100, 0, -100,
      100, 0, -100,
      100, 0,  100,
      -100, 0,  100
    ],
    normals: [
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0
    ],
    faces: [
      2, 1, 0,
      0, 3, 2
    ],
  }
}));

scene.addShader(shadowShader);
scene.addShader(mainShader);

let last = performance.now();

const render = time => {
  window.requestAnimationFrame(render);
  
  camera.updateControls((time - last) * 60 / 1000);
  
  scene.render();
  
  last = time;
};
window.requestAnimationFrame(render);

const resize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.setAspect(width / height);
  
  gl.canvas.width = width;
  gl.canvas.height = height;
};

resize();
window.addEventListener('resize', resize);
