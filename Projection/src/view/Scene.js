import Mesh from '../shapes/Mesh.js';
import Vec3 from '../math/Vec3.js';
import Mat4 from '../math/Mat4.js';
import Ray from '../shapes/Ray.js';
import Camera from './Camera.js';

export default class Scene {
  constructor(canvas, camera) {
    this.animation = null;
    this.meshes = [];
    
    this.camera = camera;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    
    this.bufferCanvas = document.createElement('canvas');
    this.bufferContext = this.bufferCanvas.getContext('2d');
    
    this.resize();
    
    this.useWireframe = false;
    this.isStatic = false;
    this.doRayTesting = false;
    this.doCollisions = false;
    this.canDestroy = false;
    
    this.hovering = null;
    
    this.lastTime = performance.now();
    
    window.addEventListener('mousedown', e => {
      if (e.buttons === 1
       && this.canDestroy
       && this.hovering
       && this.onleftclickmesh) {
        this.onleftclickmesh(this.hovering);
      }
    });
    window.addEventListener('resize', () => this.resize());
  }
  
  on(event, callback) {
    if (['leftclickmesh'].includes(event)) {
      this[`on${event}`] = callback.bind(this);
    }
  }
  
  remove(mesh) {
    for (let i = 0; i < this.meshes.length; i++) {
      if (mesh === this.meshes[i]) {
        this.meshes.splice(i, 1);
        break;
      }
    }
  }

  destroyable(val) {
    this.canDestroy = val;
  }
  
  wireframe(val) {
    this.useWireframe = val;
  }
  
  raytest(val) {
    this.doRayTesting = val;
  }
  
  collisions(val) {
    this.doCollisions = val;
  }
  
  static(val) {
    this.isStatic = val;
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.bufferCanvas.width = window.innerWidth;
    this.bufferCanvas.height = window.innerHeight;
    this.bufferContext.translate(this.bufferCanvas.width / 2, this.bufferCanvas.height / 2);
  }
  
  add(meshes) {
    if (meshes instanceof Array) {
      this.meshes.push(...meshes);
    } else {
      this.meshes.push(meshes);
    }
  }
  
  tick(func) {
    this.callback = func;
  }
  
  checkCollisions() {
    this.camera.resize();
    
    const ray = new Ray(this.camera.position, this.camera.getRotationVector());
    let rayLength = Infinity;
    this.hovering = null;
    
    let boxes = [];
    
    for (let i = 0; i < this.meshes.length; i++) {
      boxes.push(this.meshes[i].getBoundingBox());
    }
    
    const position = this.camera.position;
    const boundingBox = this.camera.boundingBox;
    const vel = this.camera.vel;
      
    const movement = new Vec3();
    
    for (let i = 0; i < boxes.length; i++) {
      if (this.doRayTesting) {
        const intersectionLength = ray.distanceToBox(boxes[i].toArray());
        
        if (intersectionLength < rayLength && intersectionLength > 0) {
          rayLength = intersectionLength;
          this.hovering = this.meshes[i];
        }
      }
      
      if (!boxes[i].collides(boundingBox)) {
        continue;
      }
      
      const vec = boxes[i].translationVector(boundingBox, vel);
      
      if ((movement.x && vec.x)
       || (movement.y && vec.y)
       || (movement.z && vec.z)) {
        continue;
      }
      
      movement.add(vec);
    }
    
    if (movement.z) {
      vel.z = 0;
    }
    
    if (movement.x) {
      vel.x = 0;
    }
    
    if (movement.y) {
      vel.y = 0;
    }
    
    position.add(movement);
  }
  
  render(drawWireframe, lightDirection) {
    const {
      meshes,
      context,
      canvas,
      camera,
      bufferCanvas,
      bufferContext
    } = this;
    
    if (this.hovering) {
      this.hovering.setGlobalTexture([200, 200, 200]);
    }
    
    const matrix = camera.matrix();
    
    let faces = [];
    
    for (let i = 0; i < meshes.length; i++) {
      if (this.doRayTesting && meshes[i] !== this.hovering) {
        meshes[i].setGlobalTexture([100, 100, 100]);
      }
      
      faces.push.apply(faces, meshes[i].getFaces());
      
      if (meshes[i].precalc) {
        meshes[i].precalc(matrix);
      }
    }
    
    if (drawWireframe) {
      bufferContext.beginPath();
      for (let i = 0; i < faces.length; i++) {
        faces[i].render(bufferContext, matrix, camera, lightDirection, true);
      }
      bufferContext.closePath();
      bufferContext.stroke();
      
      context.drawImage(bufferCanvas, 0, 0);
      
      return;
    }
    
    const byDistance = [];
    for (let i = 0; i < faces.length; i++) {
      byDistance[i] = [
        faces[i],
        faces[i].distanceTo(camera.position)
      ];
    }
    
    const triangles = byDistance.sort((a, b) => a[1] - b[1]).reverse();
    
    for (let i = 0; i < triangles.length; i++) {
      triangles[i][0].render(bufferContext, matrix, camera, lightDirection);
    }
    
    context.drawImage(bufferCanvas, 0, 0);
    context.drawImage(bufferCanvas, 0.5, 0.5);
    context.drawImage(bufferCanvas, -0.5, -0.5);
  }
  
  update() {
    this.hovering = null;
    
    if (!this.isStatic) {
      this.animation = window.requestAnimationFrame(this.update);
    }
    
    const lastTime = this.lastTime;
    const time = performance.now();

    this.dt = (time - this.lastTime) * 0.06;
    this.dt = Math.min(this.dt, 4);
    this.lastTime = time;
    
    const {
      canvas,
      context,
      camera,
      meshes,
      bufferCanvas,
      bufferContext
    } = this;
    
    context.clearRect(
      0, 0,
      canvas.width,
      canvas.height);
    
    bufferContext.clearRect(
      -bufferCanvas.width / 2,
      -bufferCanvas.height / 2,
       bufferCanvas.width,
       bufferCanvas.height);
    
    camera.update(this.dt);
    
    if (this.doCollisions) {
      this.checkCollisions();
    }
    this.render(this.useWireframe, new Vec3(1, 0.6, -0.4));
    
    if (this.isStatic) {
      return;
    }
    
    const cursorWidth = 7;
    
    context.save();
    context.fillStyle = '#000';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(-cursorWidth  + canvas.width / 2, canvas.height / 2);
    context.lineTo(cursorWidth + canvas.width / 2, canvas.height / 2);
    context.moveTo(canvas.width / 2, canvas.height / 2 - cursorWidth);
    context.lineTo(canvas.width / 2, canvas.height / 2 + cursorWidth);
    context.closePath();
    context.stroke();
    context.restore();
    
    if (this.callback) {
      this.callback(time - lastTime);
    }
  }
  
  run() {
    this.update = this.update.bind(this);
    this.animation = window.requestAnimationFrame(this.update);
  }
  
  stop() {
    if (this.animation !== null) {
      window.cancelAnimationFrame(this.animation);
      this.animation = null;
    }
  }
}
