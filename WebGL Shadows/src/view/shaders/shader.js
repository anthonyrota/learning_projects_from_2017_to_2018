export class ShaderBase {
  constructor(gl, {
    vertex,
    fragment,
    info: {
      attribs,
      uniforms
    },
    render
  }) {
    this.vertexSource = vertex;
    this.fragmentSource = fragment;
    this.attribs = attribs;
    this.uniforms = uniforms;
    
    if (render) {
      this.render = render;
    }
    
    this.initProgram(gl);
  }
  
  clearAll(r, g, b, a, w, h) {
    this.gl.clearColor(r, g, b, a);
    this.gl.clearDepth(1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.viewport(0, 0, w || this.gl.canvas.width, h || this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  
  getLocation(locationOrString) {
    return this.locations.uniforms[locationOrString]
      || this.locations.attribs[locationOrString]
      || locationOrString;
  }
  
  setMatrix(location, matrix, numberOfComponents) {
    this.gl[`uniformMatrix${numberOfComponents}fv`](this.getLocation(location), false, matrix);
  }
  
  setVector(location, vector, numberOfComponents) {
    this.gl[`uniform${numberOfComponents}fv`](this.getLocation(location), vector);
  }
  
  setTexture(location, texture, slot) {
    this.gl.activeTexture(this.gl[`TEXTURE${slot}`]);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.uniform1i(this.getLocation(location), slot);
  }
  
  setArrayBuffer(location, buffer, numComponents) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(this.getLocation(location), numComponents, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.getLocation(location));
  }
  
  setElementArrayBuffer(buffer) {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
  }
  
  bindFramebuffer(framebuffer) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
  }
  
  unbindFramebuffer() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }
  
  drawTriangles(count) {
    this.gl.drawElements(this.gl.TRIANGLES, count, this.gl.UNSIGNED_SHORT, 0);
  }
  
  initProgram(gl) {
    this.gl = gl;
    
    this.program = this.createProgram(this.gl);
    this.locations = this.calculateLocations(this.gl, this.program);
  }
  
  calculateLocations(gl, program) {
    this.locations = { attribs: {}, uniforms: {} };
    
    for (const name of this.attribs) {
      this.locations.attribs[name] = gl.getAttribLocation(program, name);
    }
    
    for (const name of this.uniforms) {
      this.locations.uniforms[name] = gl.getUniformLocation(program, name);
    }
    
    return this.locations;
  }
  
  createProgram(gl) {
    const vertex = this.loadShader(gl, gl.VERTEX_SHADER, this.vertexSource);
    const fragment = this.loadShader(gl, gl.FRAGMENT_SHADER, this.fragmentSource);
    
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`ERROR: unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`);
    }
    
    return program;
  }
  
  loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`ERROR: Shader compile failed: ${gl.getShaderInfoLog(shader)}`);
    }
    
    return shader;
  }
  
  prerender(scene) {
    this.gl.useProgram(this.program);
    this.render(this.gl, this.locations, scene);
  }
  
  render(gl) {
    throw new Error('[WebGLShaderBase] render method must be overriden');
  }
}
