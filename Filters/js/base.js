$(function() {
  const $gototop = $('.goto-top');
  const $htmlbody = $('html, body');
  
  $gototop.click(function() {
    $htmlbody.animate({ scrollTop: 0 });
  });
  
  $(document).scroll(function() {
    const scroll = $(this).scrollTop();
    
    if (scroll > 150) {
      $gototop.addClass('show');
    } else {
      $gototop.removeClass('show');
    }
  });
});