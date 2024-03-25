import { ShaderBase } from './shader.js';

const vertex = `
  #version 300 es
  precision highp float;
  
  in vec3 in_vertexPosition;
  in vec3 in_vertexNormal;
  in vec3 in_vertexColor;
  
  uniform mat4 u_viewMatrix;
  uniform mat4 u_projMatrix;
  
  uniform vec3 u_lightDirection;
  uniform vec3 u_ambientColor;
  uniform vec3 u_diffuseColor;
  uniform vec3 u_meshTint;
  
  uniform float u_fogDistance;
  uniform float u_fogPower;
  uniform vec3 u_fogColor;
  
  uniform vec3 u_cameraPosition;
  
  uniform float u_specularReflectivity;
  uniform float u_shineDamping;
  
  flat out vec4 pass_vertexColor;
  out vec3 pass_vertexPosition;
  
  vec3 calculateSpecularLighting(vec3 toCameraVector, vec3 toLightVector, vec3 normal) {
    vec3 reflectedLightDirection = reflect(-toLightVector, normal);
    
    float specularFactor = max(dot(reflectedLightDirection, toCameraVector), 0.0);
    float specularValue = pow(specularFactor, u_shineDamping);
    
    return specularValue * u_specularReflectivity * u_diffuseColor;
  }
  
  vec3 calculateDiffuseLighting(vec3 toLightVector, vec3 normal) {
    float diffuseWeighting = max(dot(normal, toLightVector), 0.0);
    
    return u_diffuseColor * diffuseWeighting;
  }
  
  void main(void) {
    vec3 toCameraVector = normalize(u_cameraPosition - in_vertexPosition);
    vec3 toLightVector = u_lightDirection;
    
    vec3 specularLighting = calculateSpecularLighting(toCameraVector, toLightVector, in_vertexNormal);
    vec3 diffuseLighting = calculateDiffuseLighting(toLightVector, in_vertexNormal);
    
    vec3 vertexColor = in_vertexColor * (u_ambientColor + diffuseLighting + specularLighting);
    
    float distanceToCamera = length(u_cameraPosition - in_vertexPosition);
    float fogFactor = clamp(1.0 - pow(distanceToCamera / u_fogDistance, u_fogPower), 0.0, 1.0);
    
    pass_vertexColor = vec4(mix(u_fogColor, vertexColor, fogFactor), 1.0) * vec4(u_meshTint, 1.0);
    pass_vertexPosition = in_vertexPosition;
    
    gl_Position = u_projMatrix * u_viewMatrix * vec4(in_vertexPosition, 1.0);
  }
`;

const fragment = `
  #version 300 es
  precision highp float;
  
  uniform vec4 u_clippingPlane;
  uniform bool u_useClippingPlane;
  
  flat in vec4 pass_vertexColor;
  in vec3 pass_vertexPosition;
  
  out vec4 fragColor;
  
  void main(void) {
    if (u_useClippingPlane && dot(vec4(pass_vertexPosition, 1.0), u_clippingPlane) < 0.0) {
      discard;
    }
    
    fragColor = pass_vertexColor;
  }
`;

const info = {
  attribs: [
    'in_vertexPosition',
    'in_vertexNormal',
    'in_vertexColor'
  ],
  uniforms: [
    'u_projMatrix',
    'u_viewMatrix',
    'u_lightDirection',
    'u_ambientColor',
    'u_diffuseColor',
    'u_fogDistance',
    'u_fogPower',
    'u_fogColor',
    'u_cameraPosition',
    'u_clippingPlane',
    'u_useClippingPlane',
    'u_specularReflectivity',
    'u_shineDamping',
    'u_meshTint'
  ]
};

export class TerrainShader extends ShaderBase {
  constructor({ gl }) {
    super(gl, { vertex, fragment, info });
  }
  
  render(scene) {
    if (scene.getTerrainChunks().length === 0) {
      return;
    }
    
    super.setToActiveProgram();
    
    super.setVector('u_clippingPlane', scene.getClippingPlane(), 4);
    super.setBool('u_useClippingPlane', scene.isUsingClippingPlane());
    
    super.setMatrix('u_projMatrix', scene.getCamera().getProjectionMatrix(), 4);
    super.setMatrix('u_viewMatrix', scene.getCamera().getViewMatrix(), 4);
    
    super.setVector('u_cameraPosition', scene.getCamera().getPosition(), 3);
    
    super.setVector('u_ambientColor', scene.getAmbientColor(), 3);
    super.setVector('u_diffuseColor', scene.getDirectionalLight().getColor(), 3);
    super.setVector('u_meshTint', scene.getTint(), 3);
    
    super.setVector('u_lightDirection', scene.getDirectionalLight().getDirection(), 3);
    
    super.setFloat('u_fogDistance', scene.getFog().getDistance());
    super.setFloat('u_fogPower', scene.getFog().getPower());
    super.setVector('u_fogColor', scene.getFog().getColor(), 3);
    
    for (const chunk of scene.getTerrainChunks()) {
      super.setArrayBuffer('in_vertexColor', chunk.getBuffer('color'), 3);
      super.setArrayBuffer('in_vertexPosition', chunk.getBuffer('position'), 3);
      super.setArrayBuffer('in_vertexNormal', chunk.getBuffer('normal'), 3);
      super.setElementArrayBuffer(chunk.getBuffer('indices'));
      
      super.setFloat('u_specularReflectivity', chunk.getSpecularReflectivity());
      super.setFloat('u_shineDamping', chunk.getShineDamping());
      
      super.drawTriangles(chunk.getIndicesLength());
    }
  }
}
