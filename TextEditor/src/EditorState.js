export class EditorState {
  constructor ({ lines, caret }) {
    this.scrollX = 0;
    this.scrollY = 0;
    this.lines = lines;
    this.caret = caret;
  }
  
  getMaxLineLength () {
    let max = 0;
    
    for (let i = 0; i < this.lines.length; i++) {
      if (this.lines[i].length > max) {
        max = this.lines[i].length;
      }
    }
    
    return max;
  }
  
  getLinesInRange (firstIndex, lastIndex) {
    return this.lines.slice(firstIndex, lastIndex);
  }
  
  set scrollX (scrollX) {
    this._scrollX = scrollX;
  }
  
  get scrollX () {
    return this._scrollX;
  }
  
  set scrollY (scrollY) {
    this._scrollY = scrollY;
  }
  
  get scrollY () {
    return this._scrollY;
  }
}
