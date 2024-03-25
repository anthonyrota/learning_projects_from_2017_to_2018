import { Factory } from './factory.js';
import { createSearchHTML } from '../core/search-html.js';
import { getIdOfTitle } from '../core/title-id.js';

Factory.register('latest-posts', `
  <section class="site-section site-section-small site-latest-posts-section">
    <div class="container site-section-container">
      <div class="site-section-child align-center">
        <h1 class="site-brand-title">My Latest Posts</h1>
      </div>
    </div>
  </section>

  <div class="site-latest-posts-results"></div>
`);

Factory.finished(() => {
  const $container = $('.site-latest-posts-results');
  const $section = $('.site-latest-posts-section').hide();
  const max = 12;
  
  if (!$container.length) {
    return;
  }
  
  firebase.database().ref('posts').orderByChild('date').limitToLast(max).on('child_added', res => {
    const val = res.val();
    
    const title = val.title;
    const id = getIdOfTitle(title);
    const imagecaption = val.imagecaption;
    const date = val.date;
    
    const html = createSearchHTML({
      title,
      id,
      post: {
        imagecaption,
        date
      }
    });
    
    $section.show();
    $container.append(html);
  });
});
