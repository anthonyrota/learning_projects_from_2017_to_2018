import '../core/core.js';
import '../external/marked.js';

import { Comments } from '../core/comments.js';
import { showBlogContent } from '../core/blog-content.js';
import { URLParameters } from '../core/url-parameters.js';

const search = URLParameters.getPost();
const die = () => window.location.replace('/');

if (!search) {
  die();
}

Comments.init(search);

Promise.all([
  firebase.database().ref(`posts/${search}`).once('value'),
  firebase.database().ref(`content/${search}`).once('value'),
  firebase.storage().ref(`post_images/${search}`).getDownloadURL()
])
.then(res => {
  const postData = res[0].val();
  const content = res[1].val();
  const image = res[2];
  
  if (!postData) {
    die();
  }
  
  const post = {
    date: postData.date,
    imagecaption: postData.imagecaption,
    title: postData.title,
    content,
    image
  };
  
  $(() => {
    showBlogContent(post, search, () => {
      $('.site-comments-section').show();
    });
  });
})
.catch(die);
