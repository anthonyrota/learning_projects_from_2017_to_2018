/**
 * Makes the buttons animated when clicked
 * Adds a growing colorful circle to the mix!
 */
jQuery(function($) {
  const neonColors = ["#CB3301", "#FF0066", "#FF6666", "#FEFF99", "#FFFF67", "#CCFF66", "#99FE00", "#EC8EED", "#FF99CB", "#FE349A", "#CC99FE", "#6599FF", "#03CDFF", "#FFFFFF"]
  
  const randomColor = () => neonColors[Math.floor(Math.random() * neonColors.length)]
  
  $('.button-column span').each((i, btn) => {
    const $btn = $(btn)
    
    $btn.on('click', e => {
      const offset = $btn.offset()
      const mouse = {
        x: e.pageX - offset.left,
        y: e.pageY - offset.top
      }
      
      const size = 10
      const duration = 280
      
      const $circle = $('<div class="expanding-circle">')
        .css({
          position: 'absolute',
          left: mouse.x - size / 2 + 'px',
          top: mouse.y - size / 2 + 'px',
          background: randomColor(),
          width: size + 'px',
          height: size + 'px',
          transition: duration + 'ms ease-in-out',
          borderRadius: '50%',
          zIndex: 50
        })
        .appendTo($btn)
        .ready(function() {
          $circle.css({
            transform: 'translate(-50%, -50%) scale(6)',
            opacity: '0'
          })
          setTimeout(() => $circle.remove(), duration)
        })
    })
  })
})