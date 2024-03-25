export class CanvasLayer {
  constructor ({ transparent, left, top, right, bottom }) {
    this.canvas = document.createElement('canvas', { alpha: !!transparent });
    this.context = this.canvas.getContext('2d');
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.upscaleFactor = 1;
    this.compositionData = {
      offsetLeft: 0,
      offsetTop: 0
    };
  }
  
  screenToCanvasX (screenX) {
    return screenX - this.left;
  }
  
  screenToCanvasY (screenY) {
    return screenY - this.top;
  }
  
  resize (parentWidth, parentHeight, upscaleFactor) {
    this.width = parentWidth - this.right - this.left;
    this.height = parentHeight - this.bottom - this.top;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.upscale(upscaleFactor);
  }
  
  upscale (upscaleFactor) {
    this.upscaleFactor = upscaleFactor;
    this.canvas.width = this.width * upscaleFactor;
    this.canvas.height = this.height * upscaleFactor;
    this.context.setTransform(upscaleFactor, 0, 0, upscaleFactor, 0, 0);
  }
  
  contains (screenX, screenY) {
    return (
      screenX >= this.left &&
      screenX <= this.left + this.width &&
      screenY >= this.top &&
      screenY <= this.top + this.height
    );
  }
  
  clear (color) {
    if (color) {
      this.context.save();
      this.context.fillStyle = color;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.restore();
    } else {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  
  setFont () {
    this.context.font = `${this._fontSize}px ${this._font}`;
    this.fontWidth = this.context.measureText(' ').width;
  }
  
  fillRect (...args) {
    this.context.fillRect(...args);
  }
  
  fillText (...args) {
    this.context.fillText(...args);
  }
  
  get font () {
    return this._font;
  }
  
  set font (font) {
    this._font = font;
    this.setFont();
  }
  
  get fontSize () {
    return this._fontSize;
  }
  
  set fontSize (fontSize) {
    this._fontSize = fontSize;
    this.setFont();
  }
  
  get textBaseline () {
    return this.context.textBaseline;
  }
  
  set textBaseline (textBaseline) {
    this.context.textBaseline = textBaseline;
  }
  
  get fillStyle () {
    return this.context.fillStyle;
  }
  
  set fillStyle (fillStyle) {
    this.context.fillStyle = fillStyle;
  }
  
  get globalAlpha () {
    return this.context.globalAlpha;
  }
  
  set globalAlpha (globalAlpha) {
    this.context.globalAlpha = globalAlpha;
  }
}
