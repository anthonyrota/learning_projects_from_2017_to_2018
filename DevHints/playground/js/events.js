let events = {};

(function(undefined) {
  'use strict';
  
  const constrain = (n, min, max) => {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  };
  
  const mouse = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    
    set: function(x, y) {
      this.prevX = this.x;
      this.prevY = this.y;
      
      this.x = x;
      this.y = y;
    },
    
    goingLeft: function() {
      return this.x < this.prevX;
    },
    
    goingDown: function() {
      return this.y > this.prevY;
    },
    
    goingUp: function() {
      return this.y < this.prevY;
    }
  };
  
  const dragging = {
    instructions: false,
    editor: false,
    
    bars: {
      top: false,
      bottom: false
    }
  };
  
  const resizeEditors = () => {
    editors.html.resize();
    editors.css.resize();
    editors.javascript.resize();
  };
  
  const updateLeftOfEditor = () => {
    const width = $(window).width();
    const tempX = 100 * constrain(
      mouse.x / width,
      0, options.maxInstructionsWidth
    );
    const percentX = constrain(
      tempX,
      100 * options.minInstructionsWidth / width, Infinity
    );
    
    const invPercent = 100 - percentX;
    
    if (tempX < options.minInstructionsWidth / width * 100
     && !DOM.instructions.hasClass('slide-out')
     && mouse.goingLeft()) {
      
      DOM.instructions.addClass('slide-out');
      DOM.wrapper.addClass('slide-out');
      
      DOM.wrapper.css('width', 'calc(100vw - 10px)');
      
      dragging.instructions = false;
    } else {
      if (DOM.instructions.hasClass('slide-out')) {
        DOM.instructions.removeClass('slide-out');
        DOM.wrapper.removeClass('slide-out');
        
        dragging.instructions = false;
      }
      
      DOM.instructions.css('width', `${percentX}vw`);
      DOM.wrapper.css('width', `${invPercent}vw`);
    }
  };
  
  const updateRightOfEditor = () => {
    const width = DOM.wrapper.width();
    const percentX = 100 * constrain(
      (mouse.x - DOM.wrapper.offset().left) / width,
      options.minCodeareaWidth,
      options.maxCodeareaWidth
    );
    
    const invPercent = 100 - percentX;
    events.outputWidth = `calc(${invPercent}% - 15px)`;
    
    DOM.container.css('width', `${percentX}%`);
    DOM.output.css('width', events.outputWidth);
  };
  
  const updateTopOfBar = () => {
    let height = DOM.areas.html.height() + DOM.areas.css.height();
    if (mouse.goingDown() && mouse.y > height - 25) {
      height = constrain(mouse.y + 25, 0, $(window).height() - 25);
      
      const jsContainerHeight = $(window).height() - height;
      const jsHeightAsPercent = 100 * jsContainerHeight / $(window).height();
      DOM.areas.js.css('height', `${jsHeightAsPercent}%`);
    }
    
    const percentY = 100 * constrain(
      mouse.y,
      25, height - 25
    ) / $(window).height();
    
    const invPercent = 100 * height / $(window).height() - percentY;
    
    DOM.areas.html.css('height', `${percentY}%`);
    DOM.areas.css.css('height', `${invPercent}%`);
  };
  
  const updateBottomOfBar = () => {
    let height = DOM.areas.css.height() + DOM.areas.js.height();
    if (mouse.goingUp() && mouse.y < DOM.areas.html.height() + 25) {
      const htmlContainerHeight = constrain(mouse.y - 25, 25, $(window).height());
      const htmlHeightAsPercent = 100 * htmlContainerHeight / $(window).height();
      DOM.areas.html.css('height', `${htmlHeightAsPercent}%`);
      
      height = $(window).height() - htmlContainerHeight;
    }
    
    const percentY = 100 * constrain(
      mouse.y - DOM.areas.html.height(),
      25, height - 25
    ) / $(window).height();
    
    const invPercent = 100 * height / $(window).height() - percentY;
    
    DOM.areas.css.css('height', `${percentY}%`);
    DOM.areas.js.css('height', `${invPercent}%`);
  };
  
  const testIfDragging = () => {
    if (dragging.instructions) {
      updateLeftOfEditor();
    }
    
    if (dragging.editor) {
      updateRightOfEditor();
    }
    
    if (dragging.bars.top) {
      updateTopOfBar();
    }
    
    if (dragging.bars.bottom) {
      updateBottomOfBar();
    }
    
    resizeEditors();
  };
  
  const resetDraggingVariables = () => {
    dragging.instructions = false;
    dragging.editor = false;
    
    dragging.bars.top = false;
    dragging.bars.bottom = false;
  };
  
  const mouseEvents = {
    mousemove(e) {
      if (this === DOM.outputDocument[0]) {
        mouse.set(
          e.clientX + DOM.output.offset().left,
          e.clientY
        );
      } else mouse.set(e.clientX, e.clientY);
      
      testIfDragging();
    },
    
    mouseup() {
      resetDraggingVariables();
    },
    
    touchmove(e) {
      const touch = e.touches[0];
      
      if (this === DOM.outputDocument[0]) {
        mouse.set(
          touch.clientX + DOM.output.offset().left,
          touch.clientY
        );
      } else mouse.set(touch.clientX, touch.clientY);
      
      testIfDragging();
    },
    
    touchend() {
      resetDraggingVariables();
    }
  };
  
  $(window).on(mouseEvents);
  DOM.outputDocument.on(mouseEvents);
  
  DOM.resizeInstructions.on({
    mousedown(e) {
      e.preventDefault();
      
      dragging.instructions = true;
    },
    
    touchstart(e) {
      e.preventDefault();
      
      dragging.instructions = true;
    }
  });
  
  DOM.resize.on({
    mousedown(e) {
      e.preventDefault();
      
      dragging.editor = true;
    },
    
    touchstart(e) {
      e.preventDefault();
      
      dragging.editor = true;
    }
  });
  
  DOM.bars.css.on({
    mousedown(e) {
      e.preventDefault();
      
      dragging.bars.top = true;
    },
    
    touchstart(e) {
      e.preventDefault();
      
      dragging.bars.top = true;
    }
  });
  
  DOM.bars.js.on({
    mousedown(e) {
      e.preventDefault();
      
      dragging.bars.bottom = true;
    },
    
    touchstart(e) {
      e.preventDefault();
      
      dragging.bars.bottom = true;
    }
  });
  
  events = {
    resizeEditors,
    
    updateLeftOfEditor,
    updateRightOfEditor,
    
    mouseEvents,
    
    outputWidth: `calc(45% - 15px)`
  };
})();