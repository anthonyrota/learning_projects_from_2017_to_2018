let DOM = {};

(function(undefined) {
  'use strict';
  
  const instructions = $('.code-instructions');
  const resizeInstructions = $('.resize-instructions');
  
  const codeContainer = $('.code-container');
  const codeWrapper = $('.code-wrapper');
  
  const codeAreaHTML = $('.code-area.html');
  const codeInputHTML = $('#html-code');
  // const codeBarHTML = $('#html-bar');
  
  const codeAreaCSS = $('.code-area.css');
  const codeInputCSS = $('#css-code');
  const codeBarCSS = $('#css-bar');
  
  const codeAreaJS = $('.code-area.js');
  const codeInputJS = $('#javascript-code');
  const codeBarJS = $('#javascript-bar');
  
  const codeResize = $('.resize-editor');
  
  const codeOutput = $('.code-output');
  const codeOutputDocument = codeOutput[0].contentDocument
                          || codeOutput[0].contentWindow.document;
  
  DOM = {
    instructions,
    resizeInstructions,
    
    container: codeContainer,
    wrapper: codeWrapper,
    resize: codeResize,
    
    output: codeOutput,
    outputDocument: $(codeOutputDocument),
    
    areas: {
      html: codeAreaHTML,
      css: codeAreaCSS,
      js: codeAreaJS
    },
    
    inputs: {
      html: codeInputHTML,
      css: codeInputCSS,
      js: codeInputJS
    },
    
    bars: {
      // html: codeBarHTML,
      css: codeBarCSS,
      js: codeBarJS
    }
  };
})();