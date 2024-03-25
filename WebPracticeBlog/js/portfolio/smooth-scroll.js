$('a[href*="#"')
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(e) {
    if (location.pathname.replace(/^\//, '') !== this.pathname.replace(/^\//, '')
     || location.hostname !== this.hostname) {
       return;
     }
     
     let $target = $(this.hash);
     
     if (!$target.length) {
       $target = $(`[name=${this.hash.slice(1)}]`);
     }
     
     if (!$target.length) {
       return;
     }
     
     e.preventDefault();
     
     $('html, body').animate({
       scrollTop: $target.offset().top + document.body.scrollTop
     }, 2000, 'ease-in-out-exp', () => {
       $target = $($target);
       
       $target.focus();
       
       if ($target.is(':focus')) {
         return false;
       } else {
         $target.attr('tabindex', '-1');
         $target.focus();
       }
     });
  });
