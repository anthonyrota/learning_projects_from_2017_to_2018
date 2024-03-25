let options = {};

(function(undefined) {
  'use strict';
  
  const theme = 'tomorrow_night_eighties';
  
  const fontSize = 15;
  
  const minInstructionsWidth = 360;
  const maxInstructionsWidth = 0.4;
  
  const minCodeareaWidth = 0.25;
  const maxCodeareaWidth = 0.7;
  
  const defaultHTMLTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
      	<meta charset="utf-8">
      	<title>Your Code</title>
      </head>
      <body>
        
      </body>
    </html>
  `;
  
  options = {
    theme,
    
    fontSize,
    
    minInstructionsWidth,
    maxInstructionsWidth,
    
    minCodeareaWidth,
    maxCodeareaWidth,
    
    defaultHTMLTemplate
  };
})();