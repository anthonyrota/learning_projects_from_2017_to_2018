import { Factory } from './factory.js';

Factory.register('about', `
  <section class="site-section bg-accent">
    <div class="container site-section-container align-center">
      <div class="site-section-child align-center">
        <div class="card bg-white">
          <div class="site-brand-title text-align-center">A fantastic experience</div>
          <ul class="unstyled-list unstyled-list-block">
            <li><img src="img/checkbox.png" class="site-checkbox-image">Learn from our engaging blogs</li>
            <li><img src="img/checkbox.png" class="site-checkbox-image">Develop your web development skills with us</li>
            <li><img src="img/checkbox.png" class="site-checkbox-image">Become a proffesional web developer</li>
          </ul>
          <a href="/search.html" class="button button-slim-block bg-secondary text-align-center">Start Now</a>
        </div>
      </div>
    </div>
  </section>

  <section class="site-section site-section-outline">
    <div class="container site-section-container">
      <div class="site-section-child align-center text-align-center">
        <h1 class="site-brand-title">How We Work</h1>
        <h2 class="mg-none">Achieve your goals and learn from our extensive blogs</h2>
      </div>
    </div>
  </section>

  <section class="site-section">
    <div class="container site-section-container site-section-container-collapse-small">
      <div class="site-section-child">
        <p class="site-brand-title"><small>Learn From Our Blogs</small></p>
        <p class="mg-none">I create great blogs which will blow your mind away. From javascript to css to html, all of your web development content is covered in one or more of our blogs. We have 3d animations in 2d worlds, voxel style games and game development blogs all to your disposal. You were missing out in the past. Take advantage now.</p>
      </div>
      <div class="site-section-child">
        <div class="site-section-image-container">
          <img class="site-section-image" src="img/learning-svg-round.png">
        </div>
      </div>
    </div>
  </section>

  <section class="site-section">
    <div class="container site-section-container site-section-container-reverse site-section-container-collapse-small">
      <div class="site-section-child">
        <p class="site-brand-title"><small>Develop</small></p>
        <p class="mg-none">Practice what you learn. The only way to get better is to try it in real world situations. Whether that means making your own website, or creating a small game to learn javascript, the best way to learn is to practice. As they say, practice makes perfect, and that applies to web development too</p>
      </div>
      <div class="site-section-child">
        <div class="site-section-image-container">
          <img class="site-section-image" src="img/checklist-svg-image.png">
        </div>
      </div>
    </div>
  </section>

  <section class="site-section">
    <div class="container site-section-container site-section-container-collapse-small">
      <div class="site-section-child">
        <p class="site-brand-title"><small>Graduate as a proffesional developer</small></p>
        <p class="mg-none">Our blogs have rich web development based content, which will teach you not just the basics, but also the advanced skills needed to be a proffesional web developer. You will learn how to make engaging user interfaces, great looking websites and function back end and logic. Soon you will be a proffesional web developer!.</p>
      </div>
      <div class="site-section-child">
        <div class="site-section-image-container">
          <img class="site-section-image" src="img/graduations-svg-round.png">
        </div>
      </div>
    </div>
  </section>

  <section class="site-section site-section-outline">
    <div class="container site-section-container">
      <div class="site-section-child align-center text-align-center">
        <h1 class="site-brand-title">Some of our awesome content!</h1>
        <h2 class="mg-none">Here is some of the awesome stuff you will learn</h2>
      </div>
    </div>
  </section>

  <section class="site-section">
    <div class="container site-section-container site-section-container-collapse-small">
      <div class="site-section-child">
        <p class="site-brand-title"><small>Build a website</small></p>
        <p class="mg-none">Some of our blogs will teach you how to build a fully compatable, front end proffesional website. I go through the entire process with you, and explore the advantages and disadvantages of popular frameworks, including those for mobile development.</p>
        <div class="site-section-image-container">
          <img class="site-section-image" src="img/website-svg-icon.png">
        </div>
      </div>
      <div class="site-section-child">
        <p class="site-brand-title"><small>Learn to code</small></p>
        <p class="mg-none">My blogs will teach you the coding process from scratch. That includes content for bare beginners, with no prior coding experience. We will focus on javascript for logic. For the front end and the user interface we will learn html, and for styling the page we will use css.</p>
        <div class="site-section-image-container">
          <img class="site-section-image" src="img/coding-svg-image.png">
        </div>
      </div>
    </div>
  </section>

  <section class="site-section">
    <div class="container site-section-container site-section-container-collapse-small">
      <div class="site-section-child">
        <p class="site-brand-title"><small>Start a business</small></p>
        <p class="mg-none">My blogs will teach you how to start website and a business. We will teach you the basics of business management, and how to create a successful startup. Learn with us for the best experience, as we will be making many apps throughout this blog. Enjoy creating a successful business!</p>
        <div class="site-section-image-container">
          <img class="site-section-image" src="img/lightbulb-svg-image.png">
        </div>
      </div>
      <div class="site-section-child">
        <p class="site-brand-title"><small>Create an App</small></p>
        <p class="mg-none">My blog will teach you how to create an app. We will go though the basics of hybrid apps, and will go through the advantages and disadvantages of various frameworks. Some of these will be Ionic, React Native and NativeScript. I have blogs on all of these, better get reading!</p>
        <div class="site-section-image-container">
          <img class="site-section-image" src="img/app-svg-image.png">
        </div>
      </div>
    </div>
  </section>
`);
