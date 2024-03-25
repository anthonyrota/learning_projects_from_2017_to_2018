import { Factory } from './factory.js';

Factory.manditory('prepend', `
  <div class="user-verify-email-container">
    <div class="site-notification bg-dark">
      <div class="container site-notification-container">
        <p class="float-left">Please Verify Your Email For Access To Certain Priviledges</p>
        <div>
          <a href="#" class="unstyled-link user-verify-email-button">Send Verification</a>
          <a href="#" class="unstyled-link user-verify-email-close">&times;</a>
        </div>
      </div>
    </div>
  </div>
  <header class="site-header bg-white">
    <div class="container full-height">
      <div class="site-header-logo logo flex-align flex-column full-height float-left">
        <h1 class="mg-none pd-none">WebDesignBlog</h1>
        <h2 class="mg-none pd-none"><small>Learn Web Design Easy</small></h2>
      </div>

      <div class="user-profile flex-align float-right">
        <div class="text-align-center">
          <h2 class="user-profile-name"></h2>
          <a href="/user.html"><img class="user-profile-image"></a>
        </div>
      </div>

      <ul class="flex-align site-nav unstyled-list float-right">
        <li><a href="/index.html" class="unstyled-link">Home</a></li>
        <li><a href="/search.html?query=Web+Design..." class="unstyled-link">Blog</a></li>
        <li><a href="/about.html" class="unstyled-link">About</a></li>
        <li><a href="/signup.html" class="unstyled-link link-sign-up">Sign Up</a></li>
      </ul>

      <label class="site-sidebar-toggle hamburger">
        <input type="checkbox" class="site-sidebar-input-toggle">
        <span></span>
        <span></span>
        <span></span>
      </label>
    </div>
  </header>

  <sidebar class="site-sidebar bg-dark"></sidebar>
`);

Factory.finished(() => {
  const $container = $('.user-verify-email-container');
  const $send = $('.user-verify-email-button');
  const $close = $('.user-verify-email-close');

  $container.hide();

  $send.on('click', e => {
    e.preventDefault();

    const user = firebase.auth().currentUser;

    if (user && !user.emailVerified) {
      user.sendEmailVerification()
        .then(() => {
          $container.hide();
        })
        .catch(err => {
          $container.show();
        });
    }

    $container.hide();
  });

  $close.on('click', e => {
    $container.hide();
  });
});
