import { BufferData } from './buffer.js';
import { ShaderBase } from './shader.js';

const vertex = `
  attribute vec3 aVertexPosition;
  
  uniform mat4 uProjMatrix;
  uniform mat4 uViewMatrix;
  uniform mat4 uWorldMatrix;
  
  void main(void) {
    gl_Position = uProjMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0);
  }
`;

const fragment = `
  precision mediump float;
  
  vec4 encodeFloat(float depth) {
    const vec4 bitShift = vec4(256 * 256 * 256, 256 * 256, 256, 1.0);
    const vec4 bitMask = vec4(0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0);
    
    vec4 comp = fract(depth * bitShift);
    return comp - comp.xxyz * bitMask;
  }
  
  void main(void) {
    gl_FragColor = encodeFloat(gl_FragCoord.z);
  }
`;

const info = {
  attribs: [
    'aVertexPosition'
  ],
  uniforms: [
    'uProjMatrix',
    'uViewMatrix',
    'uWorldMatrix'
  ]
};

export class ShadowShader extends ShaderBase {
  constructor({
    gl,
    shadowClipNearFar,
    shadowDepthTextureSize
  }) {
    super(gl, { vertex, fragment, info });
    
    this.shadowClipNearFar = shadowClipNearFar;
    this.textureSize = shadowDepthTextureSize;
    
    this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    
    this.depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA,
      shadowDepthTextureSize, shadowDepthTextureSize,
      0, gl.RGBA, gl.UNSIGNED_BYTE, null
    );
    
    this.renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,
      shadowDepthTextureSize, shadowDepthTextureSize
    );
    
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D, this.depthTexture, 0
    );
    
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);
    
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  
  render(gl, locations, scene) {
    super.bindFramebuffer(this.framebuffer);
    super.clearAll(0, 0, 0, 1, this.textureSize, this.textureSize);
    
    super.setMatrix('uProjMatrix', scene.getDirectionalLight().getProjectionMatrix(), 4);
    super.setMatrix('uViewMatrix', scene.getDirectionalLight().getViewMatrix(), 4);
    
    for (const entity of scene.getEntities()) {
      super.setMatrix('uWorldMatrix', entity.getWorldMatrix(), 4);
      super.setArrayBuffer('aVertexPosition', entity.getBuffer('position'), 3);
      super.setElementArrayBuffer(entity.getBuffer('indices'));
      super.drawTriangles(entity.getIndicesCount());
    }
    
    super.unbindFramebuffer();
  }
}
