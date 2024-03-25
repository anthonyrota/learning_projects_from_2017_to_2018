import { ShaderBase } from './shader.js';

const vertex = `
  precision highp float;
  
  attribute vec3 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec3 aVertexColor;
  
  uniform mat4 uViewMatrix;
  uniform mat4 uProjMatrix;
  uniform mat4 uWorldMatrix;
  
  uniform mat4 uLightViewMatrix;
  uniform mat4 uLightProjMatrix;
  
  const mat4 texUnitConverter = mat4(
    0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0,
    0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);
  
  varying vec3 vVertexNormal;
  varying vec3 vVertexColor;
  
  varying vec4 shadowPosition;
  
  void main(void) {
    vec4 vertexPosition = vec4(aVertexPosition, 1.0);
    vec4 worldPosition = uWorldMatrix * vertexPosition;
    
    vVertexNormal = (uWorldMatrix * vec4(aVertexNormal, 0.0)).xyz;
    vVertexColor = aVertexColor;
    
    gl_Position = uProjMatrix * uViewMatrix * worldPosition;
    
    shadowPosition =
      texUnitConverter * uLightProjMatrix *
      uLightViewMatrix * worldPosition;
  }
`;

const fragment = `
  precision highp float;
  
  uniform vec3 uLightDirection;
  uniform vec3 uAmbientColor;
  uniform vec3 uDiffuseColor;
  
  uniform sampler2D uDepthColorTexture;
  
  varying vec3 vVertexNormal;
  varying vec3 vVertexColor;
  
  varying vec4 shadowPosition;
  
  const int shadowTexQuality = 1;
  const int shadowTexTotalRange = (shadowTexQuality * 2 + 1) * (shadowTexQuality * 2 + 1);
  
  float decodeFloat(vec4 color) {
    const vec4 bitShift = vec4(1.0 / (256.0 * 256.0 * 256.0), 1.0 / (256.0 * 256.0), 1.0 / 256.0, 1);
    
    return dot(color, bitShift);
  }
  
  void main(void) {
    float bias = 0.04;
    
    vec3 fragmentDepth = shadowPosition.xyz;
    fragmentDepth.z -= bias;
    
    float texelSize = 1.0 / __TEXTURE_SIZE__.0;
    float amountInLight = 0.0;
    
    for (int x = -shadowTexQuality; x <= shadowTexQuality; x++) {
      for (int y = -shadowTexQuality; y <= shadowTexQuality; y++) {
        float texelDepth = decodeFloat(
          texture2D(uDepthColorTexture, fragmentDepth.xy + vec2(x, y) * texelSize)
        );
        
        if (fragmentDepth.z <= texelDepth) {
          amountInLight += 1.0;
        }
      }
    }
    
    amountInLight /= float(shadowTexTotalRange);
    
    vec3 normal = normalize(vVertexNormal);
    float diffuseWeighting = max(dot(normal, uLightDirection), 0.0);
    vec3 lightColor = uAmbientColor + amountInLight * vVertexColor * uDiffuseColor * diffuseWeighting;
    
    gl_FragColor = vec4(lightColor, 1.0);
  }
`;

const info = {
  attribs: [
    'aVertexPosition',
    'aVertexNormal',
    'aVertexColor',
  ],
  uniforms: [
    'uProjMatrix',
    'uViewMatrix',
    'uWorldMatrix',
    'uLightProjMatrix',
    'uLightViewMatrix',
    'uLightDirection',
    'uAmbientColor',
    'uDiffuseColor',
    'uDepthColorTexture'
  ]
};

export class MainShader extends ShaderBase {
  constructor({
    gl,
    shadowClipNearFar,
    shadowDepthTextureSize,
    shadowDepthTexture
  }) {
    super(gl, {
      vertex,
      fragment: fragment.replace('__TEXTURE_SIZE__', shadowDepthTextureSize),
      info
    });
    
    this.shadowClipNearFar = shadowClipNearFar;
    this.shadowDepthTexture = shadowDepthTexture;
    this.shadowDepthTextureSize = shadowDepthTextureSize;
  }
  
  render(gl, locations, scene) {
    super.clearAll(0.8, 0.9, 1, 1);
    
    super.setMatrix('uProjMatrix', scene.getCamera().getProjectionMatrix(), 4);
    super.setMatrix('uViewMatrix', scene.getCamera().getViewMatrix(), 4);
    
    super.setVector('uAmbientColor', scene.getAmbientColor(), 3);
    super.setVector('uDiffuseColor', scene.getDirectionalLight().getColor(), 3);
    
    super.setMatrix('uLightViewMatrix', scene.getDirectionalLight().getViewMatrix(), 4);
    super.setMatrix('uLightProjMatrix', scene.getDirectionalLight().getProjectionMatrix(), 4);
    super.setVector('uLightDirection', scene.getDirectionalLight().getDirection(), 3);
    
    super.setTexture('uDepthColorTexture', this.shadowDepthTexture, 0);
    
    for (const entity of scene.getEntities()) {
      super.setMatrix('uWorldMatrix', entity.getWorldMatrix(), 4);
      
      super.setArrayBuffer('aVertexColor', entity.getBuffer('color'), 3);
      super.setArrayBuffer('aVertexPosition', entity.getBuffer('position'), 3);
      super.setArrayBuffer('aVertexNormal', entity.getBuffer('normal'), 3);
      
      super.setElementArrayBuffer(entity.getBuffer('indices'));
      super.drawTriangles(entity.getIndicesCount());
    }
  }
}
