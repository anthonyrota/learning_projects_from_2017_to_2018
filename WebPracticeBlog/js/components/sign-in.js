import { Factory } from './factory.js';
import { signInUser } from '../external/firebase.js';
import { Validator } from '../core/validate.js';

Factory.register('sign-in', `
  <form class="site-form site-form-sign-in">
    <div class="site-form-header bg-dark">
      Sign In To Your Account
    </div>
    <div class="site-form-content">
      <div class="text-warning site-form-sign-in-error"></div>
      <div class="site-form-input-group">
        <label>Email Address</label>
        <small class="text-warning site-form-sign-in-email-warning"></small>
        <input type="email" class="site-form-sign-in-email">
      </div>
      <div class="site-form-input-group">
        <label>Password</label>
        <small class="text-warning site-form-sign-in-password-warning"></small>
        <input type="password" class="site-form-sign-in-password">
      </div>
      <input type="submit" href="#" class="button button-block button-full bg-secondary" value="Sign In">
      <br><br>
      <div class="text-align-center">
        <a class="unstyled-link" href="/reset.html">Forgot Your Password? Reset It Here</a>
      </div>
    </div>
  </form>
`);

Factory.finished(() => {
  const $signInForm = $('.site-form-sign-in');
  const $email = $('.site-form-sign-in-email');
  const $password = $('.site-form-sign-in-password');
  const $error = $('.site-form-sign-in-error');
  const $emailWarning = $('.site-form-sign-in-email-warning');
  const $passwordWarning = $('.site-form-sign-in-password-warning');

  $signInForm.submit(e => {
    const email = $email.val();
    const password = $password.val();

    $error.html('');
    $emailWarning.html('');
    $passwordWarning.html('');

    if (!email) {
      e.preventDefault();
      $emailWarning.html('Please enter an email');
    }

    if (!password) {
      e.preventDefault();
      $passwordWarning.html('Please enter a password');
    }

    if (!email || !password) {
      return;
    }

    if (!Validator.isValidEmail(email)) {
      e.preventDefault();
      $emailWarning.html('Please enter a valid email');
      return;
    }

    signInUser(email, password)
      .then(user => {
        window.setTimeout(() => {
          window.location.replace('/');
        }, 1000);
      })
      .catch(error => {
        $error.html(error.message + '<br><br>');
      });

    e.preventDefault();
  });
});
