$('.expander').each((i, el) => {
  const $trigger = $(el);
  const delay = $trigger.hasClass('no-delay') ? 0 : 1100;
  
  const target = $trigger.attr('href');
  const $target = $(target);
  
  $trigger.focus(() => {
    $trigger.addClass('active');
    
    setTimeout(() => {
      $target.focus();
      $target.addClass('active');
    }, delay);
  });
});

const $close = $('#close');
const $contact = $('#contact');
const $inner = $('#contact > *');
const $trigger = $('.contact-trigger');

$close.click(() => {
  $contact.css('background', 'transparent');
  $inner.css('opacity', 0);
  
  setTimeout(() => {
    $contact.css('background', '#252a30');
    $inner.css('opacity', 1);
    $contact.removeClass('active');
    $trigger.removeClass('active');
  }, 400);
});
