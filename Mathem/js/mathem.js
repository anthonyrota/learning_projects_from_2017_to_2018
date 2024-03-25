$(function() {
  $(document).on('keyup', Mathem.keyUp);
  
  $(document).on('keydown', Mathem.keyDown);
  
  $('#key-delete').click(() => Mathem.delete());
  $('#key-deleteall').click(() => Mathem.deleteAll());
  $('#key-calculate').click(() => Mathem.calculate());
  
  const $previousOutputs = $('.previous-outputs');
  const $mainOutput = $('.main-output');
  const $functionModal = $('.function-modal');
  const $toggleModal = $('.toggle-modal');
  const $window = $(window);
  
  (function update () {
    requestAnimationFrame(update);
    
    $previousOutputs.css('bottom', $mainOutput.outerHeight() + 40);
    
    if ($window.width() > 567)
      $('#choice-main').addClass('chosen');
    else
      $('#choice-main').removeClass('chosen');
    
    
    if ($window.width() > 1000)
      $('#choice-trig').addClass('chosen');
    else
      $('#choice-trig').removeClass('chosen');
  })();
  
  const fmUlLi = $('.function-modal ul li');
  fmUlLi.click(function() {
    const isActive = $(this).hasClass('active');
    fmUlLi.removeClass('active');
    
    if (!isActive)
      $(this).toggleClass('active');
  });
  
  $toggleModal.click(function() {
    $functionModal.toggleClass('active');
  });
  
  $(document).click(function() {
    if (!$toggleModal.is(':hover')
     && !$functionModal.is(':hover'))
     $functionModal.removeClass('active');
  });
});