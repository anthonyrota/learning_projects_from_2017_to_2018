import { Factory } from './factory.js';

const input = `
  <h1 class="site-brand-title">Start With Our Blog</h1>
  <div class="site-form-input-group">
    <label>Search For A Category</label>
    <input type="text" class="site-search" placeholder="HTML5 Web Development...">
  </div>
`;

Factory.register('search', `
  <section class="site-section">
    <div class="container site-section-container site-section-container-collapse-small">
      <div class="site-section-child align-center">
        ${input}
      </div>
      <div class="site-section-child align-center">
        <h1 class="site-brand-title">Or, Hire me</h1>
        <div class="site-form-input-group">
          <label>Click here for my portfolio</label>
          <a href="/portfolio.html" class="unstyled-link text-align-center button button-ghost">Portfolio</a>
        </div>
      </div>
    </div>
  </section>
`);

Factory.register('search-bare', `
  <section class="site-section">
    <div class="container site-section-container">
      <div class="site-section-child align-center">
        ${input}
      </div>
    </div>
  </section>
`);

Factory.register('search-bare-no-redirect', `
  <section class="site-section">
    <div class="container site-section-container">
      <div class="site-section-child align-center">
        ${input.replace('class="site-search"', 'class="site-search-no-redirect"')}
      </div>
    </div>
  </section>
`);

Factory.finished(() => {
  const $siteSearch = $('.site-search');

  $siteSearch.on('keyup', ({ keyCode }) => {
    if (keyCode === 13) {
      const search = $siteSearch.val();
      
      window.location.replace(`/search.html?query=${search}`);
    }
  });
});
