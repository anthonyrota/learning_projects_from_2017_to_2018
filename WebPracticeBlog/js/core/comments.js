import { CommentUI } from './comment-ui-manager.js';
import { getUserByUID } from '../external/firebase.js';

class CommentManager {
  constructor() {
    this.ui = new CommentUI();
  }
  
  validate(user, $warning, $submit) {
    if (!user) {
      $warning.html('You must be signed in to post a comment');
      $submit.addClass('button-disabled');
      return;
    }
    
    if (!user.emailVerified) {
      $warning.html('Your email must be validated');
      $submit.addClass('button-disabled');
      return;
    }
    
    $warning.html('');
    $submit.removeClass('button-disabled');
  }
  
  init(title) {
    this.ui.init(title);
    
    const $submit = $('.site-form-post-comment');
    const $submitButton = $('.site-form-post-comment-submit-button');
    const $warning = $('.site-form-post-comment-warning');
    const $message = $('.site-form-post-comment-message');
    const $comments = $('.site-comments-container');
    
    firebase.auth().onAuthStateChanged(user => {
      this.validate(user, $warning, $submitButton);
    });
    
    this.validate(firebase.auth().currentUser, $warning, $submitButton);
    
    $submit.submit(e => {
      e.preventDefault();
      
      this.preSubmitPost($message, $warning, title);
    });
  }
  
  preSubmitPost($message, $warning, title) {
    const message = $message.val();
    const user = firebase.auth().currentUser;
    
    if (!user || !user.emailVerified) {
      return;
    }
    
    $warning.html('');
    
    if (!message) {
      $warning.html('Please Enter a Message');
      return;
    }
    
    if (message.length < 10) {
      $warning.html('The message must be at least 10 characters in length');
      return;
    }
    
    if (message.length > 1000) {
      $warning.html('The message cannot be greater than 1000 characters in length');
      return;
    }
    
    this.post(title, user, message, $warning);
    
    $message.val('');
  }
  
  async post(blogTitle, user, comment, $error) {
    const newComment = firebase.database().ref(`comments/${blogTitle}/${user.uid}`).push();
    const date = Date.now();
    
    try {
      await newComment.set({ comment, date });
      
      this.ui.add({
        user: await getUserByUID(user.uid),
        message: comment,
        date
      }, true);
    } catch (err) {
      if ($error) {
        $error.html(`OOPS! Sometime Went Wrong: ${err.message}. It may take up to an hour for your email to be authenticated. Please stay patient!`);
      }
    }
  }
}

export const Comments = new CommentManager();
