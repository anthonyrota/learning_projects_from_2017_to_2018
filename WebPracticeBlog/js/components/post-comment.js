import { Factory } from './factory.js';

Factory.register('post-comment', `
  <section class="site-section bg-white">
    <div class="container site-section-container">
      <div class="site-section-child align-center">
        <form class="site-form site-form-post-comment box-shadow">
          <div class="site-form-header bg-dark">
            Post a Comment
          </div>
          <div class="site-form-content">
            <div class="site-form-input-group">
              <label>Message</label>
              <textarea type="email" class="site-form-post-comment-message textarea-large"></textarea>
            </div>
            <input type="submit" href="#" class="button button-block button-full bg-secondary site-form-post-comment-submit-button" value="Post Comment">
            <br><br>
            <p class="text-warning site-form-post-comment-warning"></p>
          </div>
        </form>
      </div>
    </div>
  </section>
`);
