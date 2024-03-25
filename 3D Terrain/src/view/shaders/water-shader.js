import { WaterFramebuffer } from './water-framebuffer.js';
import { ShaderBase } from './shader.js';

const vertex = `
  #version 300 es
  precision highp float;
  
  uniform mat4 u_viewMatrix;
  uniform mat4 u_projMatrix;
  
  uniform float u_waveLength;
  uniform float u_waveAmplitude;
  uniform float u_waveSlowdown;
  
  uniform float u_specularReflectivity;
  uniform float u_shineDamping;
  
  uniform vec3 u_waterPosition;
  
  uniform vec3 u_lightDirection;
  uniform vec3 u_diffuseColor;
  
  uniform vec3 u_cameraPosition;
  
  uniform float u_timePassed;
  uniform float u_triangleSize;
  
  in vec2 in_vertexPosition;
  in vec4 in_vertexIndicator;
  
  out vec4 pass_clipSpaceGrid;
  out vec4 pass_clipSpaceReal;
  
  out vec3 pass_vertexPosition;
  out vec3 pass_vertexNormal;
  out vec3 pass_toCameraVector;
  out vec3 pass_specularColor;
  out vec3 pass_diffuseColor;
  
  const float PI = 3.1415926535897932384626433832795;
  
  vec3 calculateDiffuseLighting(vec3 toLightVector, vec3 normal) {
    float brightness = max(dot(toLightVector, normal), 0.0);
    
    return brightness * u_diffuseColor;
  }
  
  vec3 calculateSpecularLighting(vec3 toCameraVector, vec3 toLightVector, vec3 normal) {
    vec3 reflectedLightDirection = reflect(-toLightVector, normal);
    
    float specularFactor = max(dot(reflectedLightDirection, toCameraVector), 0.0);
    float specularValue = pow(specularFactor, u_shineDamping);
    
    return specularValue * u_specularReflectivity * u_diffuseColor;
  }
    
  float generateOffset(float x, float z, float v1, float v2) {
    float waveTime = u_timePassed / u_waveSlowdown;
    
  	float radiansX = ((mod(x + z * x * v1, u_waveLength) / u_waveLength) + waveTime * mod(x * 0.8 + z, 1.5)) * 2.0 * PI;
  	float radiansZ = ((mod(v2 * (z * x + x * z), u_waveLength) / u_waveLength) + waveTime * 2.0 * mod(x, 2.0)) * 2.0 * PI;
  	
  	return u_waveAmplitude * 0.5 * (sin(radiansZ) + cos(radiansX));
  }
  
  vec3 applyDistortion(vec3 vertex) {
    return vertex + vec3(
      generateOffset(vertex.x, vertex.z, 0.20, 0.10),
      generateOffset(vertex.x, vertex.z, 0.10, 0.30),
      generateOffset(vertex.x, vertex.z, 0.15, 0.20)
    );
  }
  
  vec3 getVertexPosition(vec2 indicator) {
    vec2 position = in_vertexPosition + indicator * u_triangleSize;
    
    return vec3(position.x, 0.0, position.y) + u_waterPosition;
  }
  
  vec3 calculateNormal(vec3 vertex1, vec3 vertex2, vec3 vertex3) {
  	vec3 tangent = vertex2 - vertex1;
  	vec3 bitangent = vertex3 - vertex1;
  	
  	return normalize(cross(tangent, bitangent));
  }
  
  void main(void) {
    vec3 vertex1 = getVertexPosition(vec2(0.0, 0.0));
    vec3 vertex2 = getVertexPosition(in_vertexIndicator.xy);
    vec3 vertex3 = getVertexPosition(in_vertexIndicator.zw);
    
    vec4 clipSpaceGrid = u_projMatrix * u_viewMatrix * vec4(vertex1, 1.0);
    
    vertex1 = applyDistortion(vertex1);
    vertex2 = applyDistortion(vertex2);
    vertex3 = applyDistortion(vertex3);
    
    vec3 vertexNormal = calculateNormal(vertex1, vertex2, vertex3);
    vec4 clipSpaceReal = u_projMatrix * u_viewMatrix * vec4(vertex1, 1.0);
    
    vec3 toCameraVector = normalize(u_cameraPosition - vertex1);
    vec3 toLightVector = u_lightDirection;
    
	  vec3 specularColor = calculateSpecularLighting(toCameraVector, u_lightDirection, vertexNormal);
	  vec3 diffuseColor = calculateDiffuseLighting(u_lightDirection, vertexNormal);
	  
	  gl_Position = clipSpaceReal;
    
    pass_vertexPosition = vertex1;
    pass_clipSpaceGrid = clipSpaceGrid;
    pass_clipSpaceReal = clipSpaceReal;
    pass_vertexNormal = vertexNormal;
    pass_toCameraVector = toCameraVector;
    pass_specularColor = specularColor;
    pass_diffuseColor = diffuseColor;
  }
`;

const fragment = `
  #version 300 es
  precision highp float;
  
  uniform vec3 u_cameraPosition;
  
  uniform float u_fresnelReflectivity;
  uniform float u_minBlueness;
  uniform float u_maxBlueness;
  uniform float u_murkyDepth;
  
  uniform vec3 u_waterColor;
  uniform vec3 u_meshTint;
  uniform vec2 u_nearFarPlanes;
  
  uniform sampler2D u_reflectionTexture;
  uniform sampler2D u_refractionTexture;
  uniform sampler2D u_depthTexture;
  
  uniform float u_fogDistance;
  uniform float u_fogPower;
  uniform vec3 u_fogColor;
  
  in vec4 pass_clipSpaceGrid;
  in vec4 pass_clipSpaceReal;
  
  in vec3 pass_vertexPosition;
  in vec3 pass_vertexNormal;
  in vec3 pass_toCameraVector;
  in vec3 pass_specularColor;
  in vec3 pass_diffuseColor;
  
  out vec4 fragmentColor;
  
  vec3 applyMurkiness(vec3 refractColor, float waterDepth) {
    float murkyFactor = clamp(waterDepth / u_murkyDepth, 0.0, 1.0);
  	float murkiness = u_minBlueness + murkyFactor * (u_maxBlueness - u_minBlueness);
  	
  	return mix(refractColor, u_waterColor, murkiness);
  }
  
  float toLinearDepth(float zDepth) {
  	float near = u_nearFarPlanes.x;
  	float far = u_nearFarPlanes.y;
  	
  	return 2.0 * near * far / (far + near - (2.0 * zDepth - 1.0) * (far - near));
  }
  
  float calculateWaterDepth(vec2 textureCoords) {
    float floorDepth = texture(u_depthTexture, textureCoords).r;
    float floorDistance = toLinearDepth(floorDepth);
    
    float waterDepth = gl_FragCoord.z;
    float waterDistance = toLinearDepth(waterDepth);
    
    return floorDistance - waterDistance;
  }
  
  float calculateFresnel() {
    vec3 viewVector = normalize(pass_toCameraVector);
    vec3 normal = normalize(pass_vertexNormal);
    
    float refractiveFactor = dot(viewVector, normal);
    float refractiveValue = pow(refractiveFactor, u_fresnelReflectivity);
    
    return clamp(refractiveValue, 0.0, 1.0);
  }
  
  vec2 clipSpaceToTextureCoords(vec4 clipSpace) {
    vec2 normalizedDeviceCoords = clipSpace.xy / clipSpace.w;
    vec2 textureCoords = normalizedDeviceCoords / 2.0 + 0.5;
    
    return clamp(textureCoords, 0.002, 0.998);
  }
  
  void main(void) {
    vec2 textureCoordsReal = clipSpaceToTextureCoords(pass_clipSpaceReal);
    vec2 textureCoordsGrid = clipSpaceToTextureCoords(pass_clipSpaceGrid);
    
    vec2 refractionTextureCoords = textureCoordsGrid;
    vec2 reflectionTextureCoords = vec2(textureCoordsGrid.x, 1.0 - textureCoordsGrid.y);
    
    float waterDepth = calculateWaterDepth(textureCoordsReal);
    
    vec3 refractColor = texture(u_refractionTexture, refractionTextureCoords).rgb;
    vec3 reflectColor = texture(u_reflectionTexture, reflectionTextureCoords).rgb;
    
    refractColor = applyMurkiness(refractColor, waterDepth);
    reflectColor = mix(reflectColor, u_waterColor, u_minBlueness);
    
    vec3 finalColor = mix(reflectColor, refractColor, calculateFresnel());
    vec3 finalColorWithLighting = finalColor * pass_diffuseColor + pass_specularColor;
    
    float distanceToCamera = length(u_cameraPosition - pass_vertexPosition);
    float fogFactor = clamp(1.0 - pow(distanceToCamera / u_fogDistance, u_fogPower), 0.0, 1.0);
    
    vec3 finalColorWithFogApplied = mix(u_fogColor, finalColorWithLighting, fogFactor);
    
    fragmentColor = vec4(finalColorWithFogApplied * mix(u_meshTint, vec3(1.0), 0.3), 1.0);
  }
`;

const info = {
  attribs: [
    'in_vertexPosition',
    'in_vertexIndicator'
  ],
  uniforms: [
    'u_waterColor',
    'u_nearFarPlanes',
    'u_reflectionTexture',
    'u_refractionTexture',
    'u_depthTexture',
    'u_viewMatrix',
    'u_projMatrix',
    'u_waterPosition',
    'u_lightDirection',
    'u_cameraPosition',
    'u_timePassed',
    'u_triangleSize',
    'u_fogColor',
    'u_fogDistance',
    'u_fogPower',
    'u_diffuseColor',
    'u_waveLength',
    'u_waveAmplitude',
    'u_waveSlowdown',
    'u_specularReflectivity',
    'u_shineDamping',
    'u_fresnelReflectivity',
    'u_minBlueness',
    'u_maxBlueness',
    'u_murkyDepth',
    'u_meshTint'
  ]
};

export class WaterShader extends ShaderBase {
  constructor({
    gl,
    scene,
    reflectionWidth,
    reflectionHeight,
    refractionWidth,
    refractionHeight,
    reflectOffset,
    refractOffset,
    waveLength,
    waveAmplitude,
    waveSlowdown,
    specularReflectivity,
    shineDamping,
    fresnelReflectivity,
    minBlueness,
    maxBlueness,
    murkyDepth,
    elevation
  }) {
    super(gl, { vertex, fragment, info });
    
    this.reflectionWidth = reflectionWidth;
    this.reflectionHeight = reflectionHeight;
    this.refractionWidth = refractionWidth;
    this.refractionHeight = refractionHeight;
    this.reflectOffset = reflectOffset;
    this.refractOffset = refractOffset;
    this.waveLength = waveLength;
    this.waveAmplitude = waveAmplitude;
    this.waveSlowdown = waveSlowdown;
    this.specularReflectivity = specularReflectivity;
    this.shineDamping = shineDamping;
    this.fresnelReflectivity = fresnelReflectivity;
    this.minBlueness = minBlueness;
    this.maxBlueness = maxBlueness;
    this.murkyDepth = murkyDepth;
    this.elevation = elevation;
    
    this.framebuffer = new WaterFramebuffer({
      gl,
      scene,
      reflectionWidth,
      reflectionHeight,
      refractionWidth,
      refractionHeight
    });
    
    this.clippingPlane = vec4.create();
  }
  
  bindReflectionFramebuffer(scene) {
    this.framebuffer.bindReflectionFramebuffer();
    this.applyReflectionClippingPlane(scene);
  }
  
  bindRefractionFramebuffer(scene) {
    this.framebuffer.bindRefractionFramebuffer();
    this.applyRefractionClippingPlane(scene);
  }
  
  unbindFramebuffer() {
    this.framebuffer.unbindFramebuffer();
  }
  
  applyReflectionClippingPlane(scene) {
    vec4.set(this.clippingPlane, 0, 1, 0, -this.elevation + this.reflectOffset);
    
    scene.setClippingPlane(this.clippingPlane);
  }
  
  applyRefractionClippingPlane(scene) {
    vec4.set(this.clippingPlane, 0, -1, 0, this.elevation + this.refractOffset);
    
    scene.setClippingPlane(this.clippingPlane);
  }
  
  render(scene) {
    if (scene.getTerrainChunks().length === 0) {
      return;
    }
    
    super.setToActiveProgram();
    super.disableCullFace();
    
    super.setFloat('u_timePassed', performance.now());
    
    super.setFloat('u_waveLength', this.waveLength);
    super.setFloat('u_waveAmplitude', this.waveAmplitude);
    super.setFloat('u_waveSlowdown', this.waveSlowdown);
    super.setFloat('u_specularReflectivity', this.specularReflectivity);
    super.setFloat('u_shineDamping', this.shineDamping);
    super.setFloat('u_fresnelReflectivity', this.fresnelReflectivity);
    super.setFloat('u_minBlueness', this.minBlueness);
    super.setFloat('u_maxBlueness', this.maxBlueness);
    super.setFloat('u_murkyDepth', this.murkyDepth);
    
    super.setMatrix('u_projMatrix', scene.getCamera().getProjectionMatrix(), 4);
    super.setMatrix('u_viewMatrix', scene.getCamera().getViewMatrix(), 4);
    
    super.setVector('u_cameraPosition', scene.getCamera().getPosition(), 3);
    super.setVector('u_diffuseColor', scene.getDirectionalLight().getColor(), 3);
    super.setVector('u_meshTint', scene.getTint(), 3);
    
    super.setVector('u_lightDirection', scene.getDirectionalLight().getDirection(), 3);
    
    super.setFloat('u_fogDistance', scene.getFog().getDistance());
    super.setFloat('u_fogPower', scene.getFog().getPower());
    super.setVector('u_fogColor', scene.getFog().getColor(), 3);
    
    super.setVector('u_nearFarPlanes', scene.getCamera().getNearFarPlanes(), 2);
    
    super.setTexture('u_reflectionTexture', this.framebuffer.getReflectionTexture(), 0);
    super.setTexture('u_refractionTexture', this.framebuffer.getRefractionTexture(), 1);
    super.setTexture('u_depthTexture', this.framebuffer.getRefractionDepthTexture(), 2);
    
    for (const chunk of scene.getTerrainChunks()) {
      super.setFloat('u_triangleSize', chunk.getWater().getTriangleSize());
      
      super.setVector('u_waterColor', chunk.getWater().getColor(), 3);
      super.setVector('u_waterPosition', chunk.getWater().getPosition(), 3);
      
      super.setArrayBuffer('in_vertexPosition', chunk.getWater().getVertices(), 2);
      super.setArrayBuffer('in_vertexIndicator', chunk.getWater().getIndicators(), 4);
      
      super.drawTrianglesWithoutIndices(chunk.getWater().getVerticesLength());
    }
    
    super.enableCullFace();
  }
}
