import { escapeHTML } from './escape-html.js';
import { formatDate } from './format-date.js';

export const createSearchHTML = (x, imageURL, gotImageCallback) => {
  if (imageURL) {
    x.post.image = imageURL;
  }
  
  const $html = $(`
    <div class="site-search-result bg-white">
      <div class="site-search-result-head bg-dark">
        ${x.post.image ? `<img src="${x.post.image}">` : ''}
      </div>

      <div class="site-search-result-body bg-white">
        <div class="site-brand-title site-search-result-title">${x.title}</div>
        ${x.post.imagecaption ? `<h2 class="site-search-result-caption">${escapeHTML(x.post.imagecaption)}</h2>` : ''}
        <p>${formatDate(x.post.date)}</p>

        <a
          href="/blog.html?post=${x.id.replace(/ /g, '+')}"
          class="button site-search-result-button button-slim-block bg-secondary text-align-center">
            Read
        </a>
      </div>
    </div>
  `);
  
  if (!x.post.image) {
    const $head = $html.children('.site-search-result-head');
  
    firebase.storage().ref(`post_images/${x.id}`).getDownloadURL().then(url => {
      $head.append(`<img src="${url}">`);
      
      if (gotImageCallback) {
        gotImageCallback(url);
      }
    });
  }
  
  return $html;
};
