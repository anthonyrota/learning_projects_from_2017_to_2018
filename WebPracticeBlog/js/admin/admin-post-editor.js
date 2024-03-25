export class AdminPostEditor {
  constructor(manager, postId) {
    this.manager = manager;
    this.postId = postId;
    
    this.init(postId);
  }
  
  async init(postId) {
    $('.admin-container').show();
    $('.add-this-post-to-the-server').html('Update This Post');
    $('.write-post-trigger').hide();
    $('.admin-json-upload-child > *:not(.admin-json-upload-child-save-as)').hide();
    $('.site-loader').hide();
    
    const res = await Promise.all([
      firebase.database().ref(`posts/${postId}`).once('value'),
      firebase.database().ref(`content/${postId}`).once('value'),
      firebase.storage().ref(`post_images/${postId}`).getDownloadURL()
    ]);
    
    const data = res[0].val();
    const content = res[1].val();
    const image = res[2];
    
    if (!data) {
      this.manager.die();
      return;
    }
    
    this.manager.loadFromJSON(JSON.stringify({
      title: data.title,
      imagecaption: data.imagecaption,
      image,
      content
    }), true);
    
    this.manager.initWritingPosts(true, postId);
  }
  
  async updateDataInServer({
    id,
    previousPostId,
    isSame,
    isUnique,
    data,
    content,
    image,
    success,
    error
  }) {
    const formattedImageString = image.trim().replace(/data:image\/jpeg;base64,/g, '');
    const imageType = 'base64';
    const imageOptions = { contentType: 'image/jpeg' };
    const imageRef = firebase.storage().ref(`post_images/${id}`);
    const imageTask = imageRef.putString(formattedImageString, imageType, imageOptions);
    
    if (isSame) {
      Promise.all([
        firebase.database().ref(`posts/${id}`).set(data),
        firebase.database().ref(`content/${id}`).set(content),
        imageTask
      ])
      .then(success)
      .catch(error);
    }
    
    if (isUnique) {
      const res = await firebase.database().ref(`comments/${previousPostId}`).once('value');
      const comments = res.val();
      
      const promises = [
        firebase.database().ref(`posts/${previousPostId}`).remove(),
        firebase.database().ref(`comments/${previousPostId}`).remove(),
        firebase.database().ref(`content/${previousPostId}`).remove(),
        firebase.storage().ref(`post_images/${previousPostId}`).delete(),
        firebase.database().ref(`posts/${id}`).set(data),
        firebase.database().ref(`content/${id}`).set(content),
        imageTask
      ];
      
      if (comments) {
        const commentsRef = firebase.database().ref(`comments/${id}`);
        const commentsTask = commentsRef.set(comments);
        
        promises.push(comments);
      }
      
      Promise.all(promises).then(success).catch(error);
    }
  }
}
