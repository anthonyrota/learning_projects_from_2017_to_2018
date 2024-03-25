import { PointerControls } from '../../interaction/pointer-controls.js';
import { EventManager } from'../../interaction/event-manager.js';
import { KeyControls } from '../../interaction/key-controls.js';

const temp = vec3.create();
const origin = vec3.fromValues(0, 0, 0);
const UP = vec3.fromValues(0, 1, 0);

export class PlayerCamera {
  constructor(element, fov, aspect, near, far) {
    this.keyControls = new KeyControls(this);
    
    this.eventManager = new EventManager(this, {
      mousemove: this.onmousemove,
      keycontrols: this.keyControls
    });
    
    this.gameElement = element;
    this.pointerControls = new PointerControls(this.eventManager, this.gameElement);
    
    this.velocity = vec3.create();
    this.position = vec3.fromValues(0, 0, -10);
    
    this.rotation = new Float32Array(2);
    this.speed = 4 / 60;
    this.sensitivity = 180;
    
    this.keyBindings = {
      'SPACE': vec3.fromValues(0, 1, 0),
      'SHIFT': vec3.fromValues(0, -1, 0),
      'W UP_ARROW': vec3.fromValues(0, 0, -1),
      'S DOWN_ARROW': vec3.fromValues(0, 0, 1),
      'D RIGHT_ARROW': vec3.fromValues(1, 0, 0),
      'A LEFT_ARROW': vec3.fromValues(-1, 0, 0)
    };
    
    this.fov = fov * Math.PI / 180;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    
    this.lookAtMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    
    this.calculateProjectionMatrix();
    this.calculateLookAtMatrix();
  }
  
  setAspect(aspect) {
    this.aspect = aspect;
    this.calculateProjectionMatrix();
  }
  
  onmousemove(e) {
    this.rotation[0] += e.movementY * this.sensitivity / 600;
    this.rotation[1] -= e.movementX * this.sensitivity / 600;
    
    this.rotation[0] = Math.max(Math.min(this.rotation[0], 89), -89);
  }
  
  getRotationVector() {
    const x = this.rotation[1] * Math.PI / 180;
    const y = this.rotation[0] * Math.PI / 180;
    
    const cy = Math.cos(y);
    const cx = Math.cos(x);
    const sy = Math.sin(y);
    const sx = Math.sin(x);
    
    return vec3.set(temp, cy * sx, sy, cy * cx);
  }
  
  updateControls(dt) {
    const {
      keyBindings,
      keyControls,
      velocity,
      position,
      rotation,
      speed
    } = this;
    
    for (const key in keyBindings) {
      if (!keyControls.isPressed(key)) {
        continue;
      }
      
      vec3.rotateY(temp, keyBindings[key], origin, rotation[1] * Math.PI / 180);
      vec3.scale(temp, temp, speed);
      vec3.add(velocity, velocity, temp);
    }
    
    vec3.scale(temp, velocity, dt);
    vec3.add(position, position, temp);
    vec3.scale(velocity, velocity, 0.86);
    
    this.calculateLookAtMatrix();
  }
  
  calculateProjectionMatrix() {
    mat4.perspective(
      this.projectionMatrix,
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
  }
  
  calculateLookAtMatrix() {
    const lookAtMatrix = this.lookAtMatrix;
    const position = this.position;
    const rotation = this.getRotationVector();
    
    mat4.lookAt(
      lookAtMatrix,
      position,
      vec3.sub(temp, position, rotation),
      UP
    );
  }
  
  getProjectionMatrix() {
    return this.projectionMatrix;
  }
  
  getViewMatrix() {
    return this.lookAtMatrix;
  }
}
