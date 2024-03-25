let utils = {};

(function(undefined) {
  'use strict';
  
  const template = options.defaultHTMLTemplate;
  
  const prepareSource = () => {
    const html = editors.html.getValue();
    const css = editors.css.getValue();
    const js = editors.javascript.getValue();
    
    let src = template;
    
    src = src.replace('</body>', html + '</body>');
    src = src.replace('</head>', '<style>' + css + '</style>' + '</head>');
    src = src.replace('</body>', '<script>' + js + '</script>' + '</body>');

    return src;
  };
  
  const render = () => {
    DOM.output.remove();
    
    DOM.output = $('<iframe>', {
      class: 'code-output'
    });
    DOM.output.css('width', events.outputWidth);
    
    DOM.output.ready(() => {
      DOM.outputDocument = DOM.output[0].contentDocument
                        || DOM.output[0].contentWindow.document;
      
      DOM.outputDocument = $(DOM.outputDocument);
      DOM.outputDocument.on(events.mouseEvents);
    });
    
    DOM.wrapper.append(DOM.output);
    
    const src = prepareSource();
    const doc = DOM.output[0].contentDocument
             || DOM.output[0].contentWindow.document;
    
    doc.open();
    doc.write(src);
    doc.close();
  };
  
  utils = {
    template,
    prepareSource,
    render
  };
})();