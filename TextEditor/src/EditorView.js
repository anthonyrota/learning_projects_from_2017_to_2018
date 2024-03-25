import { CanvasLayerManager } from './CanvasLayerManager.js';
import { CanvasLayer } from './CanvasLayer.js';
import { getPixelRatio } from './getPixelRatio.js';
import { constrain } from './constrain.js';

export class EditorView {
  constructor ({ style }) {
    this.style = style;
    this.layerManager = new CanvasLayerManager(document.body, [
      ['editorText', new CanvasLayer({
        transparent: true,
        left: this.style.editorPadding,
        top: 0,
        right: 0,
        bottom: 0
      })],
      ['ranges', new CanvasLayer({
        transparent: true,
        left: this.style.editorPadding,
        top: 0,
        right: 0,
        bottom: 0
      })]
    ]);
    this.layerManager.attach();
  }
  
  get lineSize () {
    return this.style.lineHeight * this.style.fontSize;
  }
  
  attachEditor (editor) {
    this.editor = editor;
  }
  
  resize () {
    this.layerManager.resize({ upscaleFactor: getPixelRatio() });
    this.layerManager.layers.editorText.font = this.style.font;
    this.layerManager.layers.editorText.fontSize = this.style.fontSize;
    this.layerManager.layers.editorText.textBaseline = 'top';
  }
  
  isPositionInsideEditorText (screenX, screenY) {
    return this.layerManager.layers.editorText.contains(screenX, screenY);
  }
  
  convertPixelPositionToTextPosition (screenX, screenY) {
    const lineIndex = constrain(
      this.getPreviousLineIndex(this.layerManager.layers.editorText.screenToCanvasY(screenY)),
      0,
      this.editor.state.lines.length - 1
    );
    
    const textIndex = constrain(
      this.getPreviousTextIndex(this.layerManager.layers.editorText.screenToCanvasX(screenX) + this.layerManager.layers.editorText.fontWidth / 2),
      0,
      this.editor.state.lines[lineIndex].length
    );
    
    return {
      lineIndex,
      textIndex
    };
  }
  
  constrainScrollX (x) {
    return constrain(x, 0, Math.max(this.editor.state.getMaxLineLength() * this.layerManager.layers.editorText.fontWidth - this.layerManager.layers.editorText.width, 0));
  }
  
  constrainScrollY (y) {
    return constrain(y, 0, this.editor.state.lines.length * this.lineSize - this.layerManager.layers.editorText.height);
  }
  
  getPreviousLineIndex (position) {
    return Math.max(Math.floor((this.editor.state.scrollY + position) / this.lineSize), 0);
  }
  
  getNextLineIndex (position) {
    return Math.max(Math.ceil((this.editor.state.scrollY + position) / this.lineSize), 0);
  }
  
  getPreviousTextIndex (position) {
    return Math.max(Math.floor((this.editor.state.scrollX + position) / this.layerManager.layers.editorText.fontWidth), 0);
  }
  
  getNextTextIndex (position) {
    return Math.max(Math.ceil((this.editor.state.scrollX + position) / this.layerManager.layers.editorText.fontWidth), 0);
  }
  
  getCanvasPositionX (textIndex) {
    return this.layerManager.layers.editorText.fontWidth * textIndex - this.editor.state.scrollX;
  }
  
  getCanvasPositionY (lineIndex) {
    return this.lineSize * lineIndex - this.editor.state.scrollY;
  }
  
  renderEditorText () {
    this.layerManager.layers.editorText.clear(this.style.editorBackgroundColor);
    
    const firstLineIndex = this.getPreviousLineIndex(0);
    const lastLineIndex = this.getNextLineIndex(this.layerManager.layers.editorText.height);
    const firstTextIndex = Math.max(this.getPreviousTextIndex(0), 0);
    const lastTextIndex = Math.max(this.getNextTextIndex(this.layerManager.layers.editorText.width), 0);
    const widthOfSkippedText = firstTextIndex * this.layerManager.layers.editorText.fontWidth;
    const textX = widthOfSkippedText - this.editor.state.scrollX;
    
    this.layerManager.layers.editorText.fillStyle = this.style.textColor;
    
    this.editor.state.getLinesInRange(firstLineIndex, lastLineIndex).forEach((lineText, index) => {
      const visibleText = lineText.slice(firstTextIndex, lastTextIndex);
      const textY = (index + firstLineIndex) * this.lineSize - this.editor.state.scrollY;
      
      this.layerManager.layers.editorText.fillText(visibleText, textX, textY);
    });
    
    this.layerManager.compose();
  }
  
  renderRanges () {
    this.layerManager.layers.ranges.clear();
    this.layerManager.layers.ranges.fillStyle = this.style.caretColor;
    this.layerManager.layers.ranges.globalAlpha = this.editor.state.caret.opacity;
    this.layerManager.layers.ranges.fillRect(
      this.getCanvasPositionX(this.editor.state.caret.textIndex) - this.style.caretWidth / 2,
      this.getCanvasPositionY(this.editor.state.caret.lineIndex),
      this.style.caretWidth,
      this.lineSize
    );
    
    this.layerManager.compose();
  }
}
