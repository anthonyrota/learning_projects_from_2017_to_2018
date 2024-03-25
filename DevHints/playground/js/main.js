window.Tutorial = function() {};

(function(undefined) {
  'use strict';
  
  Tutorial = function({
    instructions,
    template
  }) {
    const {
      title,
      summary,
      main
    } = instructions;
    
    const {
      sizing,
      html,
      css,
      js
    } = template;
    
    $('.code-instructions .instructions-title').html(title);
    $('.code-instructions .instructions-summary').html(summary);
    $('.code-instructions .main-instructions').html(main);
    
    $('pre code').each((i, block) => {
      hljs.highlightBlock(block);
    });
    
    if (html) {
      editors.html.setValue(html);
      editors.html.clearSelection();
    }
    
    if (css) {
      editors.css.setValue(css);
      editors.css.clearSelection();
    }
    
    if (js) {
      editors.javascript.setValue(js);
      editors.javascript.clearSelection();
    }
    
    utils.render();
  };
})();