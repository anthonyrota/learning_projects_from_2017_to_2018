const renderer = new marked.Renderer();

renderer.code = (code, lang) => {
  const validLang = lang && hljs.getLanguage(lang);
  const highlighted = validLang ? hljs.highlight(lang, code).value : code;
  
  return `<pre class="hljs ${lang}"><code class="hljs-code">${highlighted}</code></pre>`;
};

marked.setOptions({ renderer });
