import { Factory } from './factory.js';
import { createUser } from '../external/firebase.js';
import { Validator } from '../core/validate.js';

const html = `
  <form class="site-form site-form-sign-up">
    <div class="site-form-header bg-dark">
      Sign Up And Create a New Account
    </div>
    <div class="site-form-content">
      <div class="text-warning site-form-sign-up-error"></div>
      <div class="site-form-input-group">
        <label>First Name</label>
        <small class="text-warning site-form-sign-up-first-name-warning"></small>
        <input type="text" class="site-form-sign-up-first-name">
      </div>
      <div class="site-form-input-group">
        <label>Last Name</label>
        <small class="text-warning site-form-sign-up-last-name-warning"></small>
        <input type="text" class="site-form-sign-up-last-name">
      </div>
      <div class="site-form-input-group">
        <label>Email Address</label>
        <small class="text-warning site-form-sign-up-email-warning"></small>
        <input type="email" class="site-form-sign-up-email">
      </div>
      <div class="site-form-input-group">
        <label>Password</label>
        <small class="text-warning site-form-sign-up-password-warning"></small>
        <input type="password" class="site-form-sign-up-password">
      </div>
      <div class="site-form-input-group">
        <label>Confirm Password</label>
        <small class="text-warning site-form-sign-up-password-confirm-warning"></small>
        <input type="password" class="site-form-sign-up-password-confirm">
      </div>
      <input type="submit" href="#" class="button button-block button-full bg-secondary" value="Sign Up">
      <br><br>
      <div class="text-align-center">
        <a class="unstyled-link" href="/login.html">Already Have an Account? Login here</a>
      </div>
    </div>
  </form>
`;

Factory.register('sign-up', html);
Factory.register(
  'sign-up-box-shadow',
  html.replace('site-form-sign-up', 'site-form-sign-up box-shadow')
);

Factory.finished(() => {
  const $signUpForm = $('.site-form-sign-up');

  const $fields = {
    first: $('.site-form-sign-up-first-name'),
    last: $('.site-form-sign-up-last-name'),
    email: $('.site-form-sign-up-email'),
    password: $('.site-form-sign-up-password'),
    confirm: $('.site-form-sign-up-password-confirm')
  };

  const $warnings = {
    first: $('.site-form-sign-up-first-name-warning'),
    last: $('.site-form-sign-up-last-name-warning'),
    email: $('.site-form-sign-up-email-warning'),
    password: $('.site-form-sign-up-password-warning'),
    confirm: $('.site-form-sign-up-password-confirm-warning'),
    error: $('.site-form-sign-up-error')
  };

  const clearWarnings = () => {
    for (let warning in $warnings) {
      $warnings[warning].html('');
    }
  };

  const checkForValue = (e, val, warning) => {
    if (!val) {
      e.preventDefault();
      $warnings[warning].html('Cannot Be Empty');
    }
  };

  $signUpForm.submit(e => {
    const first = $fields.first.val();
    const last = $fields.last.val();
    const email = $fields.email.val();
    const password = $fields.password.val();
    const confirm = $fields.confirm.val();

    clearWarnings();

    checkForValue(e, first, 'first');
    checkForValue(e, last, 'last');
    checkForValue(e, email, 'email');
    checkForValue(e, password, 'password');
    checkForValue(e, confirm, 'confirm');

    if (!first || !last || !email || !password || !confirm) {
      return;
    }

    const validName = /^[a-zA-Z0-9.,\- ]+$/;

    if (!validName.test(first) || !validName.test(last)) {
      e.preventDefault();
      $warnings.first.html('Please enter an alphanumerical name');
      $warnings.last.html('Please enter an alphanumerical name');
      return;
    }

    if (!Validator.isValidEmail(email)) {
      e.preventDefault();
      $warnings.email.html('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      e.preventDefault();
      $warnings.password.html('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirm) {
      e.preventDefault();
      $warnings.confirm.html('Passwords must match');
      return;
    }

    createUser(email, password, first, last,
      () => {
        window.setTimeout(() => {
          window.location.replace('/');
        }, 1000);
      },
      error => {
        $warnings.error.html(error.message + '<br><br>');
      }
    );

    e.preventDefault();
  });
});
