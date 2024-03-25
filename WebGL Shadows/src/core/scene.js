export class Scene {
  constructor(canvas) {
    if (typeof canvas === 'string') {
      canvas = document.querySelector(canvas);
    }
    
    this.canvas = canvas;
    this.gl = this.canvas.getContext('webgl')
      || this.canvas.getContext('experimental-webgl');
    
    this.entities = [];
    this.shaders = [];
    
    this.camera = null;
    this.directionalLight = null;
    this.ambientColor = null;
  }
  
  render() {
    for (const shader of this.shaders) {
      shader.prerender(this);
    }
  }
  
  addShader(shader) {
    this.shaders.push(shader);
  }
  
  add(entity) {
    entity.getBufferData().bindBuffers(this.gl);
    
    this.entities.push(entity);
  }
  
  getEntities() {
    return this.entities;
  }
  
  getCanvas() {
    return this.canvas;
  }
  
  getCanvasGl() {
    return this.gl;
  }
  
  setCamera(camera) {
    this.camera = camera;
  }
  
  getCamera() {
    return this.camera;
  }
  
  setDirectionalLight(light) {
    this.directionalLight = light;
  }
  
  getDirectionalLight() {
    return this.directionalLight;
  }
  
  setAmbientColor(color) {
    this.ambientColor = color;
  }
  
  getAmbientColor() {
    return this.ambientColor;
  }
}
