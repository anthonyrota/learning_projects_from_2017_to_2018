import { escapeHTML } from './escape-html.js';
import { formatDate } from './format-date.js';

export const showBlogContent = (post, id, callback) => {
  const $blog = {
    title: $('.site-blog-title'),
    description: $('.site-blog-description'),
    content: $('.site-blog-content'),
    loader: $('.site-loader'),
    container: $('.site-blog-container'),
    image: $('.site-blog-image'),
    imageCaption: $('.site-blog-image-caption')
  };
  
  const author = 'Anthony Rota';
  
  const content = marked(post.content);
  const date = formatDate(post.date);
  const image = post.image;
  const title = post.title;
  const caption = escapeHTML(post.imagecaption);
  
  $blog.loader.remove();
  $blog.container.css('opacity', 1);
  
  $blog.description.html(`By ${author} on ${date}`);
  $blog.title.html(title);
  $blog.content.html(content);
  $blog.imageCaption.html(caption);
  
  if (image) {
    $blog.image.show();
    $blog.image.css('opacity', 0);
    $blog.image.attr('src', image);
    
    $blog.image.on('load', e => {
      $blog.image.css('opacity', 1);
    });
  } else {
    $blog.image.hide();
    $blog.image.attr('src', '');
  }
  
  if (callback) {
    callback();
  }
};
