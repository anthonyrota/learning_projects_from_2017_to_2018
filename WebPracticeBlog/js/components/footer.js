import { Factory } from './factory.js';

Factory.manditory('append', `
  <section class="site-footer bg-dark">
    <div class="container container-small site-footer-container">
      <div class="site-footer-section site-footer-navigation">
        <h1 class="site-footer-header">Pages</h1>
      </div>

      <div class="site-footer-section site-footer-social-media">
        <h1 class="site-footer-header">Social Media</h1>

        <ul class="unstyled-list site-footer-section-list">
          <li><a class="unstyled-link" href="#">Facebook</a></li>
          <li><a class="unstyled-link" href="#">Twitter</a></li>
          <li><a class="unstyled-link" href="#">Instagram</a></li>
          <li><a class="unstyled-link" href="#">Github</a></li>
        </ul>
      </div>
    </div>
  </section>
`);

Factory.finished(() => {
  const $sidebarToggle = $('.site-sidebar-input-toggle');
  const $hamburgerSidebarToggle = $('.site-sidebar-toggle');
  const $sidebar = $('.site-sidebar');
  const $mainNav = $('.site-nav');
  const $footerNavigation = $('.site-footer-navigation');

  $mainNav
    .clone()
    .removeClass('site-nav float-right flex-align')
    .addClass('sidebar-nav')
    .appendTo($sidebar);

  $mainNav
    .clone()
    .removeClass('site-nav float-right flex-align')
    .addClass('footer-nav site-footer-section-list')
    .appendTo($footerNavigation);

  $sidebarToggle.change(() => {
    $hamburgerSidebarToggle.toggleClass('site-sidebar-toggle-active');
    $sidebar.toggleClass('site-sidebar-active');
  });
});
