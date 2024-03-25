$(document).ready(() => {
  const $website = $('.webcontent-container');
  const $header = $('.webpage-header');
  const $mainTitle = $('.header--main-title h2');
  const $highlightInfo = $('h3.highlight-info-text');
  const $mainNav = $('.main-nav');
  const $sidebar = $('.navigation-sidebar');
  const $scrollProgress = $('.navigation-sidebar aside');
  const $document = $(document);
  const $documentBody = $(document.body);
  const $window = $(window);
  
  const $fixedHeader = $header
          .clone()
            .addClass('webpage-header-fixed blue')
            .appendTo($header);
        
        $fixedHeader
          .children('.header--main-title')
            .addClass('fixed');
        
        $fixedHeader
          .children('.main-nav')
            .addClass('fixed');
  
  const $sidebarButton = $('.sidebar-button');
  
  $sidebarButton.click(() => {
    $sidebar.toggleClass('active');
    $sidebarButton.toggleClass('active');
    $header.toggleClass('active');
    $website.toggleClass('active');
    $fixedHeader.toggleClass('active');
    $documentBody.toggleClass('no-scroll');
  });
  
  $window.resize(() => {
    $sidebar.removeClass('active');
    $sidebarButton.removeClass('active');
    $header.removeClass('active');
    $website.removeClass('active');
    $fixedHeader.removeClass('active');
    $documentBody.removeClass('no-scroll');
  });
  
  $document.scroll(() => {
    const amountScrolled = $document.scrollTop();
    const percentScrolled = amountScrolled / ($document.height() - $window.height());
    $scrollProgress.css('height', percentScrolled * 100 + '%');
    
    if (amountScrolled > 2 * $header.outerHeight()) {
      $fixedHeader.addClass('webpage-header-fixed-active');
    } else {
      $fixedHeader.removeClass('webpage-header-fixed-active');
    }
  });
});
