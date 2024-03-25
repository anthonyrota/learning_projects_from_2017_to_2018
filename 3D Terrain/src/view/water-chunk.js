import { Bounds } from '../core/bounds.js';

export class WaterChunk {
  constructor({
    color,
    position,
    waterBuffer,
    renderDistance,
    width,
    depth
  }) {
    this.width = width;
    this.depth = depth;
    this.color = color;
    this.position = position;
    this.waterBuffer = waterBuffer;
    this.renderDistance = renderDistance;
    this.lodLevels = this.waterBuffer.getLodLevels();
    this.lod = 0;
    
    this.bounds = new Bounds(
      vec3.fromValues(-this.width / 2, -0.01, -this.depth / 2),
      vec3.fromValues( this.width / 2,  0.01,  this.depth / 2)
    );
    this.bounds.offset([
      this.position[0], this.position[1], this.position[2]
    ]);
  }
  
  update(playerPosition) {
    const distance = this.distanceToPoint(playerPosition);
    const normalizedDistance = Math.min(distance / this.renderDistance, 1);
    
    this.lod = Math.floor((this.lodLevels - 1) * normalizedDistance);
  }
  
  distanceToPoint(point) {
    const dx = Math.max(this.bounds.min[0] - point[0], 0, point[0] - this.bounds.max[0]);
    const dy = Math.max(this.bounds.min[1] - point[1], 0, point[1] - this.bounds.max[1]);
    const dz = Math.max(this.bounds.min[2] - point[2], 0, point[2] - this.bounds.max[2]);
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  
  getColor() {
    return this.color;
  }
  
  getPosition() {
    return this.position;
  }
  
  getTriangleSize() {
    return this.waterBuffer.getTriangleSize(this.lod);
  }
  
  getVertices() {
    return this.waterBuffer.getVertices(this.lod);
  }
  
  getIndicators() {
    return this.waterBuffer.getIndicators(this.lod);
  }
  
  getVerticesLength() {
    return this.waterBuffer.getVerticesLength(this.lod);
  }
}
