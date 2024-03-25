export class AdminPostCreator {
  constructor(manager) {
    this.manager = manager;
    
    this.init();
  }
  
  init() {
    $('.admin-container').show();
    $('.site-loader').hide();
    
    this.manager.initWritingPosts();
  }
  
  updateDataInServer({
    id,
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
    
    Promise.all([
      firebase.database().ref(`posts/${id}`).set(data),
      firebase.database().ref(`content/${id}`).set(content),
      imageRef.putString(formattedImageString, imageType, imageOptions)
    ])
    .then(success)
    .catch(error);
  }
}
