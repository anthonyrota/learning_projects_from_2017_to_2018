import { Factory } from './factory.js';

Factory.register('read-another', `
  <section class="site-section">
    <div class="container site-section-container site-section-container-collapse-large">
      <div class="site-section-child align-center">
        <div class="site-form-input-group text-align-center">
          <h1 class="site-brand-title">Interested?</h1>
          <a href="/search.html" class="text-align-center button button-block bg-primary">Read Another Blog Post</a>
        </div>
      </div>
      <div class="site-section-child align-center text-align-center">
        <div class="site-form-input-group">
          <h1 class="site-brand-title">Or.... Search For Another Blog</h1>
          <input class="button-block site-search" type="text" placeholder="HTML5 Web Development...">
        </div>
      </div>
    </div>
  </section>
`);
