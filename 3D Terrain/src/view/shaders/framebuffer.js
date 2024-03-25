export class Framebuffer {
  constructor({
    gl,
    scene,
    width,
    height,
    useDepthTexture,
    useMultisampling
  }) {
    this.gl = gl;
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.useDepthTexture = useDepthTexture;
    this.useMultisampling = useMultisampling;
    
    this.framebuffer = this.createFramebuffer();
    
    if (this.useMultisampling) {
      this.createMultisampledTextureAttachment(this.width, this.height);
    } else {
      this.createTextureAttachment(this.width, this.height);
    }
    
    if (this.useDepthTexture) {
      if (this.useMultisampling) {
        this.createDepthMultisampledTextureAttachment(this.width, this.height);
      } else {
        this.createDepthTextureAttachment(this.width, this.height);
      }
    } else {
      if (this.useMultisampling) {
        this.createDepthBufferMultisampledAttachment(this.width, this.height);
      } else {
        this.createDepthBufferAttachment(this.width, this.height);
      }
    }
    
    this.checkFramebufferStatus(gl);
    this.unbind(gl);
  }
  
  checkFramebufferStatus() {
    const gl = this.gl;
    let error = '';
    
    switch (gl.checkFramebufferStatus(gl.FRAMEBUFFER)) {
      case gl.FRAMEBUFFER_COMPLETE: return;
      case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: error = 'The attachment types are mismatched or not all framebuffer attachment points are framebuffer attachment complete'; break;
      case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: error = 'There is no attachment'; break;
      case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: error = 'Height and width of the attachment are not the same'; break;
      case gl.FRAMEBUFFER_UNSUPORTED: error = 'The format of the attachment is not supported or if depth and stencil attachments are not the same renderbuffer'; break;
      case gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: error = 'The values of gl.RENDERBUFFER_SAMPLES are different among attached renderbuffers, or are non-zero if the attached images are a mix of renderbuffers and textures'; break;
    }
    
    throw new Error('[WaterFramebuffer] WebGL Framebuffer Status Failed - ' + error);
  }
  
  createFramebuffer() {
    const framebuffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
    
    return framebuffer;
  }
  
  createMultisampledTextureAttachment(width, height) {
    const gl = this.gl;
    
    const colorTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    const renderFramebuffer = this.framebuffer;
    const colorFramebuffer = gl.createFramebuffer();
    const colorRenderbuffer = gl.createRenderbuffer();
    
    gl.bindRenderbuffer(gl.RENDERBUFFER, colorRenderbuffer);
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, 4, gl.RGBA8, width, height);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderFramebuffer);
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
      gl.RENDERBUFFER, colorRenderbuffer
    );
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, colorFramebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D, colorTexture,
      0
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    this.colorFramebuffer = colorFramebuffer;
    this.colorTexture = colorTexture;
    this.colorRenderbuffer = colorRenderbuffer;
  }
  
  createTextureAttachment(width, height) {
    const gl = this.gl;
    const texture = gl.createTexture();
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA,
      width, height,
      0, gl.RGBA, gl.UNSIGNED_BYTE, null
    );
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D, texture, 0
    );
    
    this.colorTexture = texture;
  }
  
  createDepthBufferMultisampledAttachment(width, height) {
    const gl = this.gl;
    const renderFramebuffer = this.framebuffer;
    const depthRenderbuffer = gl.createRenderbuffer();
    
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer);
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, 4, gl.DEPTH_COMPONENT16, width, height);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderFramebuffer);
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER, depthRenderbuffer
    );
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    this.depthBuffer = depthRenderbuffer;
  }
  
  createDepthBufferAttachment(width, height) {
    const gl = this.gl;
    const depthBuffer = gl.createRenderbuffer();
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,
      width, height
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER, depthBuffer
    );
    
    this.depthBuffer = depthBuffer;
  }
  
  createDepthMultisampledTextureAttachment(width, height) {
    const gl = this.gl;
    
    const renderFramebuffer = this.framebuffer;
    const colorFramebuffer = this.colorFramebuffer;
    const depthRenderbuffer = gl.createRenderbuffer();
    
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer);
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, 4, gl.DEPTH_COMPONENT16, width, height);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderFramebuffer);
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER, depthRenderbuffer
    );
    
    const depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16,
      width, height,
      0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT,
      null
    );
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, colorFramebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D, depthTexture, 0
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    this.depthBuffer = depthRenderbuffer;
    this.depthTexture = depthTexture;
  }
  
  createDepthTextureAttachment(width, height) {
    const gl = this.gl;
    const depthTexture = gl.createTexture();
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16,
      width, height,
      0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT,
      null
    );
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D, depthTexture, 0
    );
    
    this.depthTexture = depthTexture;
  }
  
  bind() {
    const { gl, scene } = this;
    
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    
    gl.clearColor(...scene.getClearColor());
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.viewport(0, 0, this.width, this.height);
    
    gl.depthFunc(gl.LEQUAL);
    
    if (this.useMultisampling) {
      gl.clearBufferfv(gl.COLOR, 0, [...scene.getClearColor(), 1]);
      gl.clearBufferfv(gl.DEPTH, 0, [1]);
    }
  }
  
  unbind() {
    const { scene, gl } = this;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    if (!this.useMultisampling) {
      return;
    }
    
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.framebuffer);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.colorFramebuffer);
    
    gl.clearBufferfv(gl.COLOR, 0, [...scene.getClearColor(), 1]);
    gl.clearBufferfv(gl.DEPTH, 0, [1]);
    gl.blitFramebuffer(
      0, 0, this.width, this.height,
      0, 0, this.width, this.height,
      gl.COLOR_BUFFER_BIT, gl.NEAREST
    );
    gl.blitFramebuffer(
      0, 0, this.width, this.height,
      0, 0, this.width, this.height,
      gl.DEPTH_BUFFER_BIT, gl.NEAREST
    );
  }
  
  getFramebuffer() {
    return this.framebuffer;
  }
  
  getColorTexture() {
    return this.colorTexture;
  }
  
  getDepthTexture() {
    return this.depthTexture;
  }
  
  getDepthBuffer() {
    return this.depthBuffer;
  }
}
