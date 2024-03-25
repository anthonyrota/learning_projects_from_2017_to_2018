/**
 * The different states for the StateManager
 */
window.STATES = {
  MAIN_MENU: 0,
  PLAYING: 1
};

/**
 * A class which manages all of the game states
 */
class StateManager {
  /**
   * Creates a new StateManager
   *
   * @param {GameManager} gameManager the parent GameManager
   */
  constructor (gameManager) {
    this.state = STATES.MAIN_MENU;
    this.gameManager = gameManager;
    
    this.targets = {
      MAIN_MENU: {
        query: '.main-menu',
        trigger: '.redirect--main-menu'
      },
      PLAYING: {
        query: '.play-menu',
        trigger: '.redirect--play-menu'
      }
    };
    
    this.overlays = {
      PAUSING: {
        query: '.pause-menu',
        trigger: '.pause'
      }
    };
    
    this.actions = {};
    
    this.init();
  }
  
  /**
   * Initiates and binds the states to the DOM elements
   */
  init () {
    let data;
    
    for (data in this.targets) {
      this.bindTarget(data, this.targets[data]);
    }
    
    for (data in this.overlays) {
      this.bindOverlay(data, this.overlays[data]);
    }
  }
  
  /**
   * Binds an action to a change of state event
   *
   * @param {String} state The name of the state id
   * @param {Function} cb The callback to be run when the state changes
   */
  
  bindAction (state, cb) {
    this.actions[state] = cb;
  }
  
  /**
   * Binds a state and its respective target
   *
   * @param {String} state The name of the state id
   * @param {String} query The query selector of the target DOM element
   * @param {String} trigger The query selector of the target trigger button
   */
  bindTarget (state, { query, trigger }) {
    const STATE_ID = window.STATES[state];
    const $element = $(query);
    const $trigger = $(trigger);
    
    $trigger.click(() => {
      if (this.state !== STATE_ID) {
        this.state = STATE_ID;
        
        for (let id in this.targets) {
          const target = this.targets[id];
          $(target.query).fadeOut(100);
        }
        
        $element.fadeIn(100);
        
        const cb = this.actions[state];
        cb && cb(this);
      }
    });
  }
  
  /**
   * Binds an overlay and its respective target
   *
   * @param {String} state The name of the state id
   * @param {String} query The query selector of the target DOM element
   * @param {String} trigger The query selector of the target trigger button
   */
  bindOverlay (state, { query, trigger }) {
    const $element = $(query);
    const $trigger = $(trigger);
    const $overlay = $('#overlay');
    
    let active = false;
    
    $trigger.click(() => {
      if (active) {
        active = false;
        $element.fadeOut(100);
        $overlay.fadeOut(100);
      } else {
        active = true;
        $element.fadeIn(100);
        $overlay.fadeIn(100);
        
        const cb = this.actions[state];
        cb && cb(this);
      }
    });
  }
}
