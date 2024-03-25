window.Devhints = 'Devhints' in window ? Devhints : {};

Devhints.aboutHTMLModules = {
  bindRevealJS(sr) {
    sr.reveal('.main-heading-container', {
      origin: 'left',
      duration: 750,
      distance: '100px',
      viewFactor: 0.5
    });
    
    sr.reveal('.simple-steps ul li:nth-child(odd)', {
      origin: 'right',
      duration: 750,
      distance: '100px',
      viewFactor: 0.25
    });
    
    sr.reveal('.simple-steps ul li:nth-child(even)', {
      origin: 'left',
      duration: 750,
      distance: '100px',
      viewFactor: 0.25
    });
  }
};