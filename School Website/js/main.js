jQuery(function($) {
  $('.main-header').clone()
    .addClass('fixed')
    .appendTo($('.main-header'));
  
  var lastScrolled = 0;
  $('body').scroll(function() {
    var amountScrolled = -$('.website').offset().top;
    
    if (amountScrolled > lastScrolled && amountScrolled > 400) {
      $('.main-header').addClass('active');
    } else {
      $('.main-header').removeClass('active');
    }
    
    lastScrolled = amountScrolled;
  });
  
  $('.main-header .toggle').click(function() {
    $('.website').toggleClass('open-for-sidebar');
    $('.main-header.fixed').toggleClass('open-for-sidebar');
    $('.nav-sidebar').toggleClass('open-for-sidebar');
  });
});