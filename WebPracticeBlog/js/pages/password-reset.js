import '../core/core.js';
import { Validator } from '../core/validate.js';

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    window.location.replace('/');
    return;
  }

  $(setup);
});

const setup = () => {
  const $form = $('.site-form-reset-password');
  const $error = $('.site-form-reset-password-error');
  const $email = $('.site-form-reset-password-email');

  $form.submit(e => {
    e.preventDefault();

    $error.html('');

    const email = $email.val();

    if (!Validator.isValidEmail(email)) {
      $error.html('Please enter a valid email address');
      return;
    }

    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        $error.removeClass('text-warning');
        $error.addClass('text-success');
        $error.html('Email Successfully Sent. Redirection To Home Page');

        window.setTimeout(() => window.location.replace('/'), 2000);
      })
      .catch(err => {
        $error.html(err.message);
      });
  });
};
