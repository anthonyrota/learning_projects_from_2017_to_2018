import '../core/core.js';
import '../external/marked.js';

import { showBlogContent } from '../core/blog-content.js';
import { URLParameters } from '../core/url-parameters.js';
import { getIdOfTitle } from '../core/title-id.js';

import { AdminPostEditor } from './admin-post-editor.js';
import { AdminPostCreator } from './admin-post-creator.js';

class AdminPostManager {
  constructor() {
    firebase.auth().onAuthStateChanged(user => this.validateUser(user));
  }
  
  die() {
    $('*').remove();
    window.location.replace('/');
  }
  
  async validateUser(user) {
    if (!user) {
      this.die();
      return;
    }
    
    const res = await firebase.database().ref(`users/${user.uid}`).once('value');
    
    if (!res.val().isAdmin) {
      this.die();
      return;
    }
    
    this.init();
  }
  
  init() {
    const editing = URLParameters.getEditing();
    
    if (editing) {
      this.editor = new AdminPostEditor(this, editing);
    } else {
      this.editor = new AdminPostCreator(this);
    }
  }
  
  initWritingPosts(isFromExistingPost, postId) {
    $('.write-post-preview').click(e => {
      e.preventDefault();
      
      this.previewPost();
    });
    
    this.initTextareaAutosizing();
    this.initMarkdownEditor();
    this.initImagePreview();
    this.initJSONDownloadSave();
    this.initUploadToServer(isFromExistingPost, postId);
  }
  
  initTextareaAutosizing() {
    $('textarea').each((i, area) => {
      const $area = $(area);
      
      $area.css('height', 100);
      $area.on('input', () => {
        $area.css('height', 'auto');
        $area.css('height', $area[0].scrollHeight);
      });
    });
  }
  
  initMarkdownEditor() {
    this.markdownEditor = new SimpleMDE({
      element: $('.write-post-content')[0],
      previewRender: text => `<div class="site-blog-container-mock" style="opacity: 1 !important"><div class="site-blog-content">${marked(text)}</div></div>`
    });
  }
  
  initImagePreview() {
    const $input = $('.write-post-image-input');
    const callback = (...args) => this.previewImage(...args);
    
    this.setupFileInput($input, callback, 'readAsDataURL');
  }
  
  initJSONDownloadSave() {
    const $upload = $('.write-post-upload-json');
    const $download = $('.write-post-download-json');
    const callback = (...args) => this.loadFromJSON(...args);
    
    this.setupFileInput($upload, callback, 'readAsText');
    
    $download.click(() => this.saveAsJSON());
  }
  
  initUploadToServer(isFromExistingPost, postId) {
    const $trigger = $('.write-post-push-to-server');
    
    $trigger.click(() => this.pushToServer(isFromExistingPost, postId));
  }
  
  previewPost() {
    const canvas = $('.write-post-image-preview')[0];
    
    const image = canvas.toDataURL('image/jpeg');
    const date = Date.now();
    const imagecaption = $('.write-post-caption').val();
    const content = this.markdownEditor.value();
    const title = $('.write-post-title').val();
    
    showBlogContent({
      image,
      date,
      content,
      imagecaption,
      title
    });
  }
  
  setupFileInput($input, callback, method) {
    $input.on('change', e => {
      e.preventDefault();
      
      const input = e.target;
      
      if (!input.files || !input.files[0]) {
        return;
      }
      
      const file = input.files[0];
      const reader = new FileReader();
      
      $(reader).on('load', e => {
        const data = e.target.result;
        
        callback(data);
      });
      
      reader[method](file);
    });
  }
  
  previewImage(src) {
    const canvas = $('.write-post-image-preview')[0];
    const context = canvas.getContext('2d');
    
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = src;
    
    $(image).on('load', () => {
      const { width, height } = image;
      const maxWidth = 600;
      
      if (width > maxWidth) {
        const scalar = maxWidth / width;
        
        canvas.width = width * scalar;
        canvas.height = height * scalar;
      } else {
        canvas.width = width;
        canvas.height = height;
      }
      
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    });
  }
  
  loadFromJSON(json, isFromExistingPost) {
    const {
      image,
      imagecaption,
      content,
      title
    } = JSON.parse(json);
    
    this.previewImage(image);
    
    $('.write-post-caption').val(imagecaption);
    $('.write-post-title').val(title);
    
    if (this.markdownEditor) {
      this.markdownEditor.value(content);
    } else {
      $('.write-post-content').val(content);
    }
    
    if (!isFromExistingPost) {
      swal('JSON Uploaded', 'Now You Can Edit The JSON!', 'success');
    }
    
    window.setTimeout(() => {
      $('textarea').each((i, area) => {
        const $area = $(area);
        
        $area.css('height', 'auto');
        $area.css('height', $area[0].scrollHeight);
      });
    }, 10);
  }
  
  saveAsJSON() {
    const name = $('.write-post-download-json-file-name').val();
    const json = this.getDataAsJSON();
    
    try {
      download(JSON.stringify(json), name, 'application/json');
      swal('JSON Downloaded', 'Now You Can Use That File For Another Session!', 'success');
    } catch (e) {
      console.error(e);
      swal('JSON Download Failed', 'Damit... Try Again', 'error');
    }
  }
  
  getDataAsJSON() {
    const canvas = $('.write-post-image-preview')[0];
    
    const image = canvas.toDataURL('image/jpeg');
    const imagecaption = $('.write-post-caption').val();
    const content = this.markdownEditor.value();
    const title = $('.write-post-title').val();
    
    return {
      image,
      imagecaption,
      content,
      title
    };
  }
  
  async pushToServer(isFromExistingPost, previousPostId) {
    const $error = $('.write-post-push-to-server-warning').html('');
    
    const json = this.getDataAsJSON();
    const required = ['content', 'image', 'imagecaption', 'title'];
    
    if (required.some(field => !json[field])) {
      $error.html('Please Fill Out All Of The Fields');
      return;
    }
    
    const title = json.title;
    
    if (title.length > 70) {
      $error.html('The Title Is Too Long');
      return;
    }
    
    const id = getIdOfTitle(title);
    
    try {
      const res = await firebase.database().ref(`posts/${id}`).once('value');
      
      const isUnique = id !== previousPostId;
      const isSame = id === previousPostId;
      
      if (isUnique && res.val()) {
        $error.html(`Another Post Has The Same Title. Please Enter A Unique Title`);
        return;
      }
      
      const data = {
        title,
        date: Date.now(),
        imagecaption: json.imagecaption
      };
      
      const content = json.content;
      const image = json.image;
      
      this.editor.updateDataInServer({
        id,
        previousPostId,
        isSame,
        isUnique,
        data,
        content,
        image,
        success: () => this.uploadSuccess(id),
        error: err => this.uploadError($error, err)
      });
    } catch (err) {
      console.error(err);
      $error.html('OOPS. Something Went Wrong' + err.message);
    }
  }
  
  uploadSuccess(id) {
    swal('Upload Successful', 'Redirecting To The Post Page', 'success');
    
    window.setTimeout(() => {
      window.location.replace(`/blog.html?post=${id.replace(/ /g, '+')}`);
    }, 2000);
  }
  
  uploadError($error, err) {
    console.error(err);
    $error.html('OOPS. Something Went Wrong... ' + err.message);
  }
}

new AdminPostManager();
