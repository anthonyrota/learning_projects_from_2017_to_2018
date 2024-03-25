export class CanvasLayerManager {
  constructor (element, canvases) {
    this.upscaleFactor = 1;
    this.element = element;
    // jshint ignore: start
    this.layers = canvases.reduce((canvases, [name, canvas]) => ({ ...canvases, [name]: canvas }), {});
    // jshint ignore: end
    this.layerArray = canvases.map(([name, canvas]) => canvas);
  }
  
  attach () {
    this.canvas = document.createElement('canvas', { alpha: false });
    this.canvas.imageSmoothingEnabled = false;
    this.context = this.canvas.getContext('2d');
    
    this.element.appendChild(this.canvas);
  }
  
  resize ({ upscaleFactor }) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.upscale(upscaleFactor);
    
    this.layerArray.forEach(layer => {
      layer.resize(this.canvas.width, this.canvas.height, upscaleFactor);
    });
  }
  
  upscale (upscaleFactor) {
    this.upscaleFactor = upscaleFactor;
    this.canvas.width = this.width * upscaleFactor;
    this.canvas.height = this.height * upscaleFactor;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.context.setTransform(upscaleFactor, 0, 0, upscaleFactor, 0, 0);
  }
  
  compose () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.layerArray.forEach(layer => {
      this.context.drawImage(
        layer.canvas,
        layer.left + layer.compositionData.offsetLeft,
        layer.top + layer.compositionData.offsetTop,
        this.canvas.width - layer.right - layer.left,
        this.canvas.height - layer.bottom - layer.top
      );
    });
  }
}
