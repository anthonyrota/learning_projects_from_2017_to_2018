import { BufferData } from '../view/shaders/buffer.js';

const IDENTITY = mat4.identity(mat4.create());

export class Entity {
  constructor({
    geometry: {
      colors,
      vertices,
      normals,
      faces
    },
    rotation = vec3.create(),
    position = vec3.create()
  }) {
    this.bufferData = new BufferData({
      color: {
        type: 'ARRAY_BUFFER',
        data: colors
      },
      position: {
        type: 'ARRAY_BUFFER',
        data: vertices
      },
      normal: {
        type: 'ARRAY_BUFFER',
        data: normals
      },
      indices: {
        type: 'ELEMENT_ARRAY_BUFFER',
        data: faces
      }
    });
    
    this.worldMatrix = mat4.create();
    this.indicesCount = faces.length;
    
    this.rotation = rotation;
    this.position = position;
    
    this.calculateWorldMatrix();
  }
  
  calculateWorldMatrix() {
    mat4.rotateY(
      this.worldMatrix,
      IDENTITY,
      this.rotation[1]
    );
    
    mat4.rotateX(
      this.worldMatrix,
      this.worldMatrix,
      this.rotation[0]
    );
    
    mat4.rotateZ(
      this.worldMatrix,
      this.worldMatrix,
      this.rotation[2]
    );
    
    mat4.translate(
      this.worldMatrix,
      this.worldMatrix,
      this.position
    );
  }
  
  getWorldMatrix() {
    return this.worldMatrix;
  }
  
  getIndicesCount() {
    return this.indicesCount;
  }
  
  getBufferData() {
    return this.bufferData;
  }
  
  getBuffers() {
    return this.bufferData.buffers;
  }
  
  getBuffer(name) {
    return this.bufferData.buffers[name];
  }
}
