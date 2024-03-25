import { attachResizeListener } from './attachResizeListener.js';
import { attachScrollListener } from './attachScrollListener.js';

export class TextEditor {
  constructor ({ state, view }) {
    this.state = state;
    this.view = view;
    this.view.attachEditor(this);
    this.resize();
    
    this.state.caret.on('positionchange', this.renderRanges.bind(this));
    this.state.caret.on('opacitychange', this.renderRanges.bind(this));
    attachResizeListener(this.resize.bind(this));
    attachScrollListener(document.body, this.scroll.bind(this));
    document.body.addEventListener('mousedown', this.handleClick.bind(this));
    document.body.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  handleKeyDown ({ key }) {
    switch (key) {
      case 'ArrowDown':
        this.state.caret.moveDown(this.state);
        break;
        
      case 'ArrowUp':
        this.state.caret.moveUp(this.state);
        break;
        
      case 'ArrowRight':
        this.state.caret.moveRight(this.state);
        break;
        
      case 'ArrowLeft':
        this.state.caret.moveLeft(this.state);
        break;
    }
  }
  
  handleClick ({ clientX, clientY }) {
    if (this.view.isPositionInsideEditorText(clientX, clientY)) {
      this.state.caret.setPosition(
        this.view.convertPixelPositionToTextPosition(
          clientX,
          clientY
        )
      );
    }
  }
  
  scroll ({ deltaX, deltaY }) {
    this.state.scrollX = this.view.constrainScrollX(this.state.scrollX + deltaX);
    this.state.scrollY = this.view.constrainScrollY(this.state.scrollY + deltaY);
    this.renderText();
    this.renderRanges();
  }
  
  resize () {
    this.view.resize();
    this.renderText();
    this.renderRanges();
  }
  
  renderText () {
    this.view.renderEditorText();
  }
  
  renderRanges () {
    this.view.renderRanges();
  }
}
