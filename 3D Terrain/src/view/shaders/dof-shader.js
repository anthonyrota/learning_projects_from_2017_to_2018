import { TexturedQuad } from '../textured-quad.js';
import { ShaderBase } from './shader.js';

const vertex = `
  #version 300 es
  precision highp float;
  
  in vec2 in_vertexPosition;
  in vec2 in_textureCoord;
  
  out vec2 pass_textureCoord;
  
  void main(void) {
    gl_Position = vec4(in_vertexPosition, 0.0, 1.0);
    
    pass_textureCoord = in_textureCoord;
  }
`;

const fragment = `
  #version 300 es
  precision highp float;
  
  uniform sampler2D u_originalTexture;
  uniform sampler2D u_depthTexture;
  uniform sampler2D u_blurredTexture;
  
  uniform float u_focalLength;
  uniform float u_focalStop;
  uniform float u_blurStrength;
  
  uniform vec2 u_focusPoint;
  uniform float uFocusSize;
  uniform float uFocusSpacing;
  
  in vec2 pass_textureCoord;
  
  out vec4 fragmentColor;
  
  float toLinearDepth(float depth) {
    float near = 0.1;
    float far = 1200.0;
    
    return 2.0 * near * far / (far + near - (2.0 * depth - 1.0) * (far - near));
  }
  
  float getBlurDiameter(vec4 depthColor, float blurCoefficient, float focusDistance) {
    float dd = toLinearDepth(depthColor.x);
    
    float xd = abs(dd - focusDistance);
    float xdd = dd < focusDistance ? focusDistance - xd : focusDistance + xd;
    float b = blurCoefficient * (xd / xdd);
    
    return b * u_blurStrength;
  }
  
  const float maxBlurRadius = 10.0;
  
  void main(void) {
    vec4 originalColor = texture(u_originalTexture, pass_textureCoord);
    vec4 depthColor = texture(u_depthTexture, pass_textureCoord);
    vec4 blurredColor = texture(u_blurredTexture, pass_textureCoord);
    
    float focusDistance = toLinearDepth(texture(u_depthTexture, u_focusPoint).x);
    
    float ms = u_focalLength / (focusDistance - u_focalLength);
    float blurCoefficient = u_focalLength * ms / u_focalStop;
    
    float blurAmount = getBlurDiameter(depthColor, blurCoefficient, focusDistance);
    float lerpAmount = min(abs(blurAmount / maxBlurRadius), 1.0);
    
    fragmentColor = mix(originalColor, blurredColor, lerpAmount);
  }
`;

const info = {
  attribs: [
    'in_vertexPosition',
    'in_textureCoord'
  ],
  uniforms: [
    'u_focalLength',
    'u_focalStop',
    'u_focusPoint',
    'u_blurStrength',
    'u_originalTexture',
    'u_blurredTexture',
    'u_depthTexture'
  ]
};

export class DOFShader extends ShaderBase {
  constructor({
    gl,
    focalLength,
    focalStop,
    focusPoint,
    blurStrength
  }) {
    super(gl, { vertex, fragment, info });
    
    this.focalLength = focalLength;
    this.focalStop = focalStop;
    this.focusPoint = focusPoint;
    this.blurStrength = blurStrength;
    
    this.quad = new TexturedQuad(gl);
  }
  
  render(originalTexture, blurredTexture, depthTexture) {
    super.setToActiveProgram();
    super.clearAll(0, 0, 0, 0);
    super.disableCullFace();
    
    super.setVector('u_focusPoint', this.focusPoint, 2);
    super.setFloat('u_focalLength', this.focalLength);
    super.setFloat('u_focalStop', this.focalStop);
    super.setFloat('u_blurStrength', this.blurStrength);
    
    super.setArrayBuffer('in_vertexPosition', this.quad.getBuffer('position'), 2);
    super.setArrayBuffer('in_textureCoord', this.quad.getBuffer('uv'), 2);
    super.setElementArrayBuffer(this.quad.getBuffer('indices'));
    
    super.setTexture('u_originalTexture', originalTexture, 0);
    super.setTexture('u_blurredTexture', blurredTexture, 1);
    super.setTexture('u_depthTexture', depthTexture, 2);
    
    super.drawTriangles(6);
    super.enableCullFace();
  }
}
