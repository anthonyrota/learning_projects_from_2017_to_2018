import Vec3 from '../math/Vec3.js';
import Mat4 from '../math/Mat4.js';
import EventHandler from './EventHandler.js';
import BoundingBox from '../shapes/BoundingBox.js';

const UP = new Vec3(0, 1, 0);

export default class Camera {
  constructor(
    view,
    position = new Vec3(0, 4, 0),
    rotation = [1, 1],
    zoom = Math.min(window.innerWidth, window.innerHeight) / 3
  ) {
    this.position = position;
    this.rotation = rotation;
    
    this.attatch(view);
    
    this.setPerspective(30, 1, 0.001, 100);
    this.setZoom(zoom);
    this.setSensitivity(160);
    
    this.resize(0.8, 1.3, 1.6);
    
    this.position.y += this.eyes;
  }

  resize(size = this.size, eyes = this.eyes, height = this.height) {
    this.size = size;
    this.height = height;
    this.eyes = eyes;
    
    const pos = this.position.clone();
    pos.y -= this.eyes;

    const hs = this.size / 2;

    this.boundingBox = new BoundingBox(
      new Vec3(-hs, 0, -hs).add(pos),
      new Vec3(hs, this.height, hs).add(pos)
    );
  }
  
  setPerspective(fov, aspect, nearZ, farZ) {
    this.fov = fov;
    this.aspect = aspect;
    this.distance = { min: nearZ, max: farZ };
    
    this.mPerspective = Mat4.perspective(
      this.fov, this.aspect, this.distance.min, this.distance.max);
  }
  
  increaseFov(amount) {
    this.fov += amount;
    
    this.mPerspective = Mat4.perspective(
      this.fov, this.aspect, this.distance.min, this.distance.max);
  }
  
  setZoom(zoom) {
    this.zoom = zoom;
    this.mZoom = Mat4.zoom(-this.zoom);
  }
  
  zoomIn(amount) {
    this.zoom = Math.max(this.zoom + amount, 10);
    this.mZoom = Mat4.zoom(-this.zoom);
  }
  
  setSpeed() {
    /* TODO */
  }
  
  setSensitivity(sensitivity) {
    this.sensitivity = sensitivity;
    this.sensitivityFactor = sensitivity / 400;
  }
  
  attatch(canvas) {
    this.view = canvas;
    
    this.speed = 0.06;
    
    this.keys = {
      87: new Vec3(0, 0, this.speed), // w
      83: new Vec3(0, 0, -this.speed), // s
      65: new Vec3(-this.speed, 0, 0), // a
      68: new Vec3(this.speed, 0, 0), // d
      32: new Vec3(0, this.speed, 0), // space
      16: new Vec3(0, -this.speed, 0) // shift
    };
    
    this.vel = new Vec3(0, 0, 0);
    this.drag = 0.9;
    
    this.scalingVel = 0;
    this.scalingDrag = this.drag;
    
    this.eventHandler = new EventHandler({
      element: canvas,
      self: this,
      mouseMove(e, vx, vy) {
        this.rotation[0] -= vy * this.sensitivityFactor;
        this.rotation[1] += vx * this.sensitivityFactor;
        
        this.rotation[0] = Math.min(Math.max(this.rotation[0], -89), 89);
      },
      scrollZoom(e, deltaX, deltaY) {
        this.scalingVel += deltaY / 4;
      }
    });
  }
  
  update(dt) {
    let movement = new Vec3(0, 0, 0);
    
    for (let code in this.keys) {
      if (this.eventHandler.pressed[code]) {
        movement.add(this.keys[code]);
      }
    }
    
    this.vel.add(movement.rotateY(this.rotation[1]).scale(dt)).scale(Math.pow(this.drag, dt));
    this.position.add(this.vel);
    
    this.scalingVel *= Math.pow(0.6, dt);
    this.zoomIn(this.scalingVel * dt);
  }
  
  getRotationVector() {
    const x = this.rotation[1] * Math.PI / 180;
    const y = this.rotation[0] * Math.PI / 180;
    
    const cy = Math.cos(y);
    
    return new Vec3(
      cy * Math.sin(x),
      Math.sin(y),
      cy * Math.cos(x));
  }
  
  matrix() {
    const mat = Mat4.multiply(
      this.mPerspective,
      this.mZoom,
      Mat4.lookAt(
        this.position,
        this.getRotationVector().add(this.position),
        UP)
    );
    
    return mat;
  }
}
