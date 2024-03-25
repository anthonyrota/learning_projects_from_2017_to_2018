let editors = {};

(function(undefined) {
  'use strict';
  
  const supported = ['javascript', 'html', 'css'];
  const aceEditors = {};
  
  supported.forEach(language => {
    const selector = language + '-code';
    const editor = ace.edit(selector);
    
    editor.$blockScrolling = Infinity;
    editor.setTheme('ace/theme/' + options.theme);
    editor.getSession().setMode('ace/mode/' + language);
    editor.getSession().setTabSize(2);
    editor.getSession().setUseWrapMode(true);
    editor.on('change', () => utils.render());
    
    aceEditors[language] = editor;
    
    const el = $(`#${selector}`);
    el.css('fontSize', options.fontSize + 'px');
  });
  
  editors = aceEditors;
})();