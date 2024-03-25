if (!Date.now) {
  Date.now = function () {
    return new Date().getTime();
  };
}

/**
 * A class that times the real world time
 */
class GameTimer {
  /**
   * Creats a new GameTimer
   *
   * @param {Number=} fps The desired fps
   */
  constructor (fps = 60) {
    this.startTime = Date.now();
    this.setFPS(fps);
  }
  
  /**
   * Sets the desired fps
   *
   * @param {Number=} fps The desired fps
   */
  setFPS (fps = 60) {
    this.desiredFPS = fps;
    this.multiplier = fps / 1000;
    
    this.reset();
  }
  
  /**
   * Resets the game timer
   */
  reset () {
    const now = Date.now();
    
    this.startTime = now;
    this.lastTime = now;
  }
  
  /**
   * Gets the total time passed since the timer began
   */
  getTotalDifferenceInTime () {
    return Date.now() - this.startTime;
  }
  
  /**
   * Formats a string (pads it)
   */
  formatString (string, value, amount) {
    while (string.length < amount) {
      string += value;
    }
    
    return string;
  }
  
  /**
   * Gets the formated time
   */
  getFormattedTime () {
    const dt = this.getTotalDifferenceInTime();
    
    let seconds = dt / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;

    seconds = Math.floor(seconds % 60);
    minutes = Math.floor(minutes % 60);
    hours = Math.floor(hours % 100);

    seconds = this.formatString(seconds, '0', 2);
    minutes = this.formatString(minutes, '0', 2);
    hours = this.formatString(hours, '0', 2);

    if (hours !== '00') {
      return `${hours}:${minutes}:${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }
  
  /**
   * Updates the current game timer
   */
  updateGameTimer () {
    const time = this.getFormattedTime();
    
    $('.play-menu .footer .timer').html(time);
  }
  
  /**
   * Gets the difference in time since the timer began
   */
  getDifferenceInTime () {
    const now = Date.now();
    const difference = now - this.lastTime;
    
    this.lastTime = now;
    
    return difference;
  }
  
  /**
   * Gets the "dt" or fps in terms of the desired fps
   *  (if the fps is 1 / desired fps, then it will return 1)
   */
  getNormalizedDifferenceInTime () {
    let normalized = this.getDifferenceInTime() * this.multiplier;
    
    if (normalized > 2) {
      return 2;
    }
    
    return normalized;
  }
}