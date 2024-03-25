const UP = vec3.fromValues(0, 1, 0);

export class DirectionalLight {
  constructor({
    direction,
    color,
    maxDistance
  }) {
    this.tempVec3 = vec3.create();
    this.direction = vec3.normalize(vec3.create(), direction);
    this.position = vec3.fromValues(0, 0, 0);
    
    this.projectionMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    
    this.maxDistance = maxDistance;
    this.color = color;
    
    this.calculateProjectionMatrix();
    this.calculateViewMatrix();
  }
  
  calculateProjectionMatrix() {
    const d = this.maxDistance;
    
    mat4.ortho(this.projectionMatrix, -d, d, -d, d, -d, d);
  }
  
  getProjectionMatrix() {
    return this.projectionMatrix;
  }
  
  calculateViewMatrix() {
    mat4.lookAt(
      this.viewMatrix,
      this.position,
      vec3.sub(this.tempVec3, this.position, this.direction),
      UP
    );
  }
  
  getViewMatrix() {
    return this.viewMatrix;
  }
  
  setColor(color) {
    this.color = color;
  }
  
  getColor() {
    return this.color;
  }
  
  getDirection() {
    return this.direction;
  }
}
