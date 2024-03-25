import { getUserByUID } from '../external/firebase.js';
import { escapeHTML } from './escape-html.js';
import { formatDate } from './format-date.js';

export class CommentUI {
  formatDate(date) {
    const time = Date.now();
    const diff = time - date;
    
    const format = (k, p) => {
      const n = Math.floor(diff / k);
      return `${n} ${p}${n === 1 || n === 0 ? '' : 's'} ago`;
    };
    
    if (diff < 300000) return 'Just Now';
    if (diff < 3600000) return format(60000, 'minute');
    if (diff < 86400000) return format(3600000, 'hour');
    if (diff < 2678400000) return format(86400000, 'day');
    
    return formatDate(date);
  }
  
  previousCommentsResolved(users, val) {
    const all = [];
    
    for (const [ uid, comments ] of Object.entries(val)) {
      for (const comment of Object.values(comments)) {
        all.push({
          user: users[uid],
          message: comment.comment,
          date: comment.date
        });
      }
    }
    
    for (const comment of all.sort((a, b) => a.date - b.date)) {
      this.add(comment);
    }
  }
  
  createHTML(photo, name, date, message) {
    return $(`
      <div class="site-comment">
        <img class="site-profile-image site-comment-image" src="${photo}">
        <div class="site-comment-right">
          <div class="site-comment-header">
            <p class="site-comment-name">${escapeHTML(name)}</p>
            <p class="site-comment-date">Posted ${this.formatDate(date)}</p>
          </div>
          <div class="site-comment-body">
            ${escapeHTML(message)}
          </div>
        </div>
      </div>
    `);
  }
  
  add({ user, message, date }, shouldScroll) {
    const $container = $('.site-comments-container');
    const time = Date.now();
    
    $('.site-comments-no-comments').hide();
    
    if (!user) {
      return;
    }
    
    const $html = this.createHTML(user.photo, user.name, date, message);
    
    $container.prepend($html);
    
    if (shouldScroll) {
      window.setTimeout(() => {
        const scrollTop = $html.offset().top - 60;
        
        $('body, html').scrollTop(scrollTop);
      });
    }
  }
  
  async init(title) {
    this.showPreviousComments(
      await firebase.database().ref(`comments/${title}`).once('value')
    );
  }
  
  async showPreviousComments(res) {
    if (!res.val()) {
      return;
    }
    
    const promises = Object.keys(res.val()).map(uid => Promise.all([ uid, getUserByUID(uid) ]));
    const data = await Promise.all(promises);
    
    this.previousCommentsResolved(
      data.reduce((users, [ uid, user ]) => ({ ...users, [uid]: user }), {}),
      res.val()
    );
  }
}
