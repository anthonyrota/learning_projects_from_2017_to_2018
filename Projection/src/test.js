import Mesh from "./shapes/Mesh.js";
import CubeMesh from "./shapes/CubeMesh.js";
import SphereMesh from "./shapes/SphereMesh.js";
import Vec3 from "./math/Vec3.js";
import Mat4 from "./math/Mat4.js";
import Camera from "./view/Camera.js";
import PlayerCamera from "./view/PlayerCamera.js";
import Scene from "./view/Scene.js";
import readSTL from "./shapes/STLReader.js";
import { vertices as bunnyVertices, cells as bunnyCells } from "./bunny.js";
import { positions as teapotVertices, cells as teapotCells } from "./teapot.js";
import { vertices as monkeyVertices, faces as monkeyCells } from "./monkey.js";

const canvas = document.querySelector("canvas");

const camera = new PlayerCamera(canvas);
camera.position.add(new Vec3(4, -2, 4));
camera.rotation[1] = 90;
const scene = new Scene(canvas, camera);
// let color = [192, 57, 43];
scene.run();
scene.raytest(true);
scene.destroyable(true);
scene.collisions(true);
// scene.wireframe(true);
// scene.static(true);

scene.on("leftclickmesh", (block) => scene.remove(block));

// scene.add(new SphereMesh(new Vec3(0, 10, 15), 10, 1, [40, 170, 50]));

// const mv = monkeyVertices.filter((_, i) => i % 8 === 0 || i % 8 === 1 || i % 8 === 2);

// scene.add(new Mesh(mv, monkeyCells, false, color));

const loadImage = (src) => {
  const img = new Image();
  img.src = src;
  return img;
};

let boxes = [];
const textures = {
  dirt: loadImage("/src/dirt.jpeg"),
  grass: loadImage("/src/grass.jpeg"),
  grassTop: loadImage("/src/grass-top.jpeg"),
  wood: loadImage("/src/wood.jpg"),
  leaves: loadImage("/src/leaves.png"),
  stone: loadImage("/src/stone.png"),
};

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    const mesh = new CubeMesh(1, new Vec3(i, 0, j));
    mesh.setTopTexture(textures.grassTop);
    mesh.setLeftTexture(textures.grass);
    mesh.setRightTexture(textures.grass);
    mesh.setFrontTexture(textures.grass);
    mesh.setBackTexture(textures.grass);
    mesh.setBottomTexture(textures.dirt);
    boxes.push(mesh);
  }
}

const tree = (x, z, h) => {
  for (let i = 1; i <= h; i++) {
    const mesh = new CubeMesh(1, new Vec3(x, i, z));
    mesh.setGlobalTexture(textures.wood);
    boxes.push(mesh);
  }
};

const fill = (x1, y1, z1, x2, y2, z2, gt, tr) => {
  for (let x = x1; x < x2 + x1; x++) {
    for (let y = y1; y < y2 + y1; y++) {
      for (let z = z1; z < z2 + z1; z++) {
        const mesh = new CubeMesh(1, new Vec3(x, y, z));
        mesh.setGlobalTexture(gt);
        if (tr) mesh.disableOverlay();
        boxes.push(mesh);
      }
    }
  }
};

tree(2, 2, 4);

fill(1, 5, 1, 3, 3, 3, textures.leaves, true);
fill(0, 6, 2, 1, 1, 1, textures.leaves, true);
fill(4, 6, 2, 1, 1, 1, textures.leaves, true);
fill(2, 6, 0, 1, 1, 1, textures.leaves, true);
fill(2, 6, 4, 1, 1, 1, textures.leaves, true);
fill(0, 6, 2, 1, 1, 1, textures.leaves, true);

fill(6, 1, 6, 3, 1, 3, textures.stone);

scene.add(boxes);

// const flatten = (a, b) => a.concat(b);
// const bv = bunnyVertices.reduce(flatten, []);
// const bc = bunnyCells.reduce(flatten, []);
// scene.add(new Mesh(bv, bc, true, color));
// scene.update();

// readSTL('/src/dragon.stl', res => {
//   console.log('rendering dragon...');
//   const dir = new Vec3(0, 6, 29, [192, 57, 43]);
//   res.vertices.map(vertex => vertex.rotateX(-90).add(dir));
//   scene.add(new Mesh(res.vertices, res.faces, true, color));
//   const time = performance.now();
//   scene.update();
//   console.log('rendering took: ' + (performance.now() - time) + ' ms');
// });

// readSTL('/src/armadillo.stl', res => {
//   console.log('rendering armadillo...');
//   const dir = new Vec3(0, -23, 110);
//   res.vertices.map(vertex => vertex.add(dir));
//   scene.add(new Mesh(res.vertices, res.faces, true, [39, 174, 96]));
//   const time = performance.now();
//   scene.update();
//   console.log('rendering took: ' + (performance.now() - time) + ' ms');
// });

// readSTL('/src/bunny.stl', res => {
//   console.log('rendering bunny...');
//   res.vertices.map(vertex => vertex.rotateX(-88).rotateY(192).add(new Vec3(0, -30, 65)));
//   scene.add(new Mesh(res.vertices, res.faces, true, [179, 109, 59]));
//   const time = performance.now();
//   scene.update();
//   console.log('rendering took: ' + (performance.now() - time) + ' ms');
// });

const debug = document.querySelector("p");
scene.tick((dt) => {
  debug.innerHTML = `
    FPS: ${(1000 / dt).toFixed(3)}<br>
    Time Difference: ${dt.toFixed(3)}ms<br>
    pos: ${camera.position.x.toFixed(2)} ${camera.position.y.toFixed(
    2
  )} ${camera.position.z.toFixed(2)}`;
});
