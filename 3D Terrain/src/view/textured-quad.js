import { BufferData } from './shaders/buffer.js';

export class TexturedQuad extends BufferData {
  constructor(gl) {
    super({
      position: {
        type: 'ARRAY_BUFFER',
        data: [
          -1, -1,
          -1,  1,
           1,  1,
           1, -1
        ]
      },
      uv: {
        type: 'ARRAY_BUFFER',
        data: [
          0, 0,
          0, 1,
          1, 1,
          1, 0
        ]
      },
      indices: {
        type: 'ELEMENT_ARRAY_BUFFER',
        data: [
          0, 1, 3,
          1, 2, 3
        ]
      }
    });
    
    super.bindBuffers(gl);
  }
}
