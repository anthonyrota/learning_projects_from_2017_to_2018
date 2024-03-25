import { TexturedQuad } from '../textured-quad.js';
import { Framebuffer } from './framebuffer.js';
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
  
  uniform vec2 u_imageResolution;
  uniform vec2 u_blurDirection;
  
  uniform sampler2D u_imageTexture;
  
  in vec2 pass_textureCoord;
  
  out vec4 fragmentColor;
  
  {{ blurFunctionDefinition }}
  
  void main(void) {
    fragmentColor = {{ blurFunctionCall }}(u_imageTexture, pass_textureCoord, u_imageResolution, u_blurDirection);
  }
`;

const blurs = {
  13: `
    vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
      vec2 off1 = vec2(1.411764705882353) * direction;
      vec2 off2 = vec2(3.2941176470588234) * direction;
      vec2 off3 = vec2(5.176470588235294) * direction;
      
      return (
        texture(image, uv) * 0.1964825501511404 +
        texture(image, uv + (off1 / resolution)) * 0.2969069646728344 +
        texture(image, uv - (off1 / resolution)) * 0.2969069646728344 +
        texture(image, uv + (off2 / resolution)) * 0.09447039785044732 +
        texture(image, uv - (off2 / resolution)) * 0.09447039785044732 +
        texture(image, uv + (off3 / resolution)) * 0.010381362401148057 +
        texture(image, uv - (off3 / resolution)) * 0.010381362401148057
      );
    }
  `,
  9: `
    vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
      vec2 off1 = vec2(1.3846153846) * direction;
      vec2 off2 = vec2(3.2307692308) * direction;
      
      return (
        texture(image, uv) * 0.2270270270 +
        texture(image, uv + (off1 / resolution)) * 0.3162162162 +
        texture(image, uv - (off1 / resolution)) * 0.3162162162 +
        texture(image, uv + (off2 / resolution)) * 0.0702702703 +
        texture(image, uv - (off2 / resolution)) * 0.0702702703
      );
    }
  `,
  5: `
    vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
      vec2 off1 = vec2(1.3333333333333333) * direction;
      
      return (
        texture(image, uv) * 0.29411764705882354 +
        texture(image, uv + (off1 / resolution)) * 0.35294117647058826 +
        texture(image, uv - (off1 / resolution)) * 0.35294117647058826
      );
    }
  `
};

const info = {
  attribs: [
    'in_vertexPosition',
    'in_textureCoord'
  ],
  uniforms: [
    'u_imageResolution',
    'u_imageTexture',
    'u_blurDirection'
  ]
};

export class GaussianBlurShader extends ShaderBase {
  constructor({
    gl,
    scene,
    width,
    height,
    radii,
    blurLevel
  }) {
    const blurFunction = blurs[blurLevel];
    
    if (!blurFunction) {
      throw new Error(`[GaussianBlurShader] The blur level ${blurLevel} does not exist`);
    }
    
    super(gl, {
      vertex,
      fragment: fragment
        .replace('{{ blurFunctionDefinition }}', blurFunction)
        .replace('{{ blurFunctionCall }}', 'blur' + blurLevel),
      info
    });
    
    this.horizontalDirections = [];
    this.verticalDirections = [];
    
    this.radii = radii;
    
    for (let i = 0; i < this.radii.length; i++) {
      this.horizontalDirections[i] = vec2.fromValues(this.radii[i], 0);
      this.verticalDirections[i] = vec2.fromValues(0, this.radii[i]);
    }
    
    this.verticalFramebuffer = new Framebuffer({ gl, scene, width, height });
    this.horizontalFramebuffer = new Framebuffer({ gl, scene, width, height });
    
    this.quad = new TexturedQuad(gl);
  }
  
  render(imageTexture, isDrawingToScreen, imageDimensions = [ this.gl.canvas.width, this.gl.canvas.height ]) {
    for (let i = 0; i < this.radii.length; i++) {
      this.draw(
        this.horizontalFramebuffer,
        i === 0 ? imageTexture : this.verticalFramebuffer.getColorTexture(),
        imageDimensions,
        this.horizontalDirections[i],
        true
      );
      this.draw(
        this.verticalFramebuffer,
        this.horizontalFramebuffer.getColorTexture(),
        imageDimensions,
        this.verticalDirections[i],
        i + 1 === this.radii.length ? !isDrawingToScreen : true
      );
    }
  }
  
  draw(framebuffer, texture, textureDimensions, direction, bind) {
    bind && framebuffer.bind();
    
    super.setToActiveProgram();
    super.disableCullFace();
    
    super.setVector('u_imageResolution', textureDimensions, 2);
    
    super.setArrayBuffer('in_vertexPosition', this.quad.getBuffer('position'), 2);
    super.setArrayBuffer('in_textureCoord', this.quad.getBuffer('uv'), 2);
    super.setElementArrayBuffer(this.quad.getBuffer('indices'));
    
    super.setVector('u_blurDirection', direction, 2);
    super.setTexture('u_imageTexture', texture, 0);
    super.drawTriangles(6);
    
    super.enableCullFace();
    
    bind && framebuffer.unbind();
  }
  
  getColorTexture() {
    return this.verticalFramebuffer.getColorTexture();
  }
}
