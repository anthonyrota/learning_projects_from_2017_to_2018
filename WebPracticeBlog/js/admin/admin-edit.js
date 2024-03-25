import '../core/core.js';
import { Search } from '../core/search-field.js';

class AdminEditManager {
  constructor() {
    firebase.auth().onAuthStateChanged(user => this.checkIfUserIsValid(user));
  }
  
  die() {
    $('*').remove();
    window.location.replace('/');
  }
  
  showElements() {
    $('.admin-container').show();
    $('.admin-edit').show();
  }
  
  bindSearch(titles) {
    const $search = $('.admin-search');
    const $count = $('.admin-search-count');
    const $results = $('.site-search-results');
  
    $results.css('display', 'flex');
  
    Search.bind({
      titles,
      $search,
      $count,
      $results,
      
      onresultcreated: (post, $base) => {
        const $body = $base.children('.site-search-result-body');
        
        $base.addClass('site-search-result-large');
        $body.children('.site-search-result-button').remove();
        
        const $delete = $(`
          <a
            href="#"
            class="button site-search-result-button button-slim-block button-warning text-align-center">
              Delete
          </a>
        `);
        
        const $edit = $(`
          <a
            href="/admin/create.html?editing=${post.id}"
            class="button site-search-result-button-2 button-slim-block bg-primary text-align-center">
              Edit
          </a>
        `);
        
        $body.append($delete);
        $body.append($edit);
        
        this.bindButtonListeners($delete, post.id);
        
        return $base;
      }
    });
  }
  
  giveDeleteFeedback(postId) {
    swal(`Successfully Deleted Post ${postId}`, 'Reloading The Page, Please Wait', 'success');
    
    window.setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
  
  async checkIfUserIsValid(user) {
    if (!user) {
      this.die();
      return;
    }
    
    try {
      const res = await firebase.database().ref(`users/${user.uid}`).once('value');
    
      if (!res.val().isAdmin) {
        this.die();
        return;
      }
      
      this.init();
    } catch (err) {
      this.die();
    }
  }
  
  async init() {
    const res = await fetch('https://webdesignblog-a4a18.firebaseio.com/posts.json?shallow=true');
    const titles = Object.keys(await res.json());
    
    this.showElements();
    this.bindSearch(titles);
  }
  
  async bindButtonListeners($delete, postId) {
    $delete.click(async e => {
      e.preventDefault();
      
      const res = await swal('Are You Sure You Want To Do This?', 'This Will Permanently Delete The Post', 'warning');
      
      if (!res) {
        return;
      }
      
      this.deletePost(postId);
    });
  }
  
  async deletePost(postId) {
    await Promise.all([
      firebase.database().ref(`posts/${postId}`).remove(),
      firebase.database().ref(`comments/${postId}`).remove(),
      firebase.database().ref(`content/${postId}`).remove(),
      firebase.storage().ref(`post_images/${postId}`).delete()
    ]);
    
    $('.admin-edit').hide();
    
    this.giveDeleteFeedback(postId);
  }
}

new AdminEditManager();
