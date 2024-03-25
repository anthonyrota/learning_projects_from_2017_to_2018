const isPowerOf2 = num => num & (num - 1) === 0;

const DONE = 'done';

const BUFFER_TYPES = {
  'ARRAY_BUFFER': 'createArrayBuffer',
  'ELEMENT_ARRAY_BUFFER': 'createElementArrayBuffer',
  'TEXTURE_2D': 'createTexture2D',
  'CUSTOM': 'createCustomData'
};

export class BufferData {
  constructor(data) {
    this.data = data;
    this.buffers = {};
  }
  
  bindBuffers(gl) {
    for (const name in this.data) {
      const { type, data } = this.data[name];
      
      if (name === DONE) continue;
      
      if (!BUFFER_TYPES[type]) {
        throw new Error(`[WebGLShader] The type provided (${type}) is not a valid buffer type (${
          Object.keys(BUFFER_TYPES).join(', ')
        })`);
      }
      
      this.buffers[name] = this[BUFFER_TYPES[type]](gl, data);
    }
    
    if (this.data[DONE]) {
      this.data[DONE](this.buffers, this.data);
    }
  }
  
  createCustomData(gl, data) {
    return data;
  }
  
  createArrayBuffer(gl, data) {
    const buffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(data),
      gl.STATIC_DRAW
    );
    
    return buffer;
  }
  
  createElementArrayBuffer(gl, data) {
    const buffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(data),
      gl.STATIC_DRAW
    );
    
    return buffer;
  }
  
  createTexture2D(gl, image) {
    const texture = gl.createTexture();
    
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    
    return texture;
  }
  
  getOriginalData() {
    return this.data;
  }
  
  getBuffers() {
    return this.buffers;
  }
}
