import { getUserByUID } from '../external/firebase.js';

const signUserOut = e => {
  firebase.auth().signOut();

  if (e) {
    e.preventDefault();
  }

  window.setTimeout(() => {
    window.location.replace('/');
  }, 500);
};

const authStateChanged = async user => {
  const $signUpForm = $('.site-form-sign-up');
  const $welcomeMessage = $('.site-user-welcome-message');
  const $verifyEmailContainer = $('.user-verify-email-container');
  const $signUpLink = $('.link-sign-up');
  const $userProfile = $('.user-profile');

  if (!user) {
    $welcomeMessage.hide();
    $userProfile.hide();
    $signUpForm.show();
    $signUpLink.html('Sign Up');
    $signUpLink.attr('href', '/signup.html');
    $verifyEmailContainer.hide();
    return;
  }

  if (!user.emailVerified) {
    $verifyEmailContainer.show();
  } else {
    $verifyEmailContainer.hide();
  }

  $welcomeMessage.show();
  $welcomeMessage.html('');

  const $signOutButton = $('<a class="button button-block bg-secondary">Logout</a>');
  $signOutButton.click(signUserOut);

  $welcomeMessage.append($signOutButton);

  $userProfile.show();
  $signUpForm.hide();

  $signUpLink.html('Log Out');
  $signUpLink.attr('href', '#');
  $signUpLink.on('click', signUserOut);
  
  const { name, photo } = await getUserByUID(user.uid);
  
  const $name = $('.user-profile-name');
  const $image = $('.user-profile-image');
  
  $welcomeMessage.prepend(`<h1>Welcome Back, ${name}</h1>`);

  $name.html(name);
  $image.attr('src', photo);
};

firebase.auth().onAuthStateChanged(user => {
  $(() => {
    authStateChanged(user);
  });
});
