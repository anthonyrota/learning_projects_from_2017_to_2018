import '../core/core.js';

import { getUserByUID } from '../external/firebase.js';
import { UserEditor } from '../core/user-editor.js';

const editor = new UserEditor();

firebase.auth().onAuthStateChanged(async user => {
  if (!user) {
    editor.die();
    return;
  }
  
  if (editor.hasUser()) {
    return;
  }
  
  init(user, await getUserByUID(user.uid));
});

const init = (...args) => {
  $(() => {
    setup(...args);
  });
};

const setup = (user, userDetails) => {
  editor.init(user, userDetails, {
    ui: {
      username: $('.site-user-name'),
      image: $('.site-user-profile-image'),
      forms: $('.site-section-edit-form'),
      visibleForms: $('.site-section-edit-form:not(.site-section-edit-form-validate-password)'),
      loading: $('.site-user-loading-section')
    },
    
    name: {
      form: $('.site-form-edit-username'),
      first: $('.site-form-edit-username-first-name'),
      last: $('.site-form-edit-username-last-name'),
      errors: {
        first: $('.site-form-edit-first-name-error'),
        last: $('.site-form-edit-last-name-error')
      }
    },
    
    photo: {
      form: $('.site-form-input-user-photo'),
      error: $('.site-form-input-user-photo-error')
    },
    
    delete: {
      modal: $('.site-section-edit-form-validate-password'),
      trigger: $('.site-form-delete-user-account-trigger'),
      password: $('.site-form-delete-account-validate-password-input'),
      submit: $('.site-form-delete-account-validate-password-submit'),
      error: $('.site-form-delete-account-validate-password-error')
    }
  });
};
