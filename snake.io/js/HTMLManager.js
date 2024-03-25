class HTMLManager {
  constructor (game) {
    this.game = game;
    
    $('.play').click(() => this.initGame());
    $('.nickname').on('keydown', e => {
      if ((e.keyCode || e.which) === 13) {
        this.initGame();
      }
    });
  }
  
  initGame () {
    $('.menu').fadeOut(100);
    $('.game').fadeIn(100);
    
    const nick = $('.nickname').val();
    
    this.game.init(nick === '' ? 'anonymous' : nick);
    
    $('.nickname').val('');
  }
}