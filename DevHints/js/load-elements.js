window.Devhints = 'Devhints' in window ? Devhints : {};

Devhints.loadElements = (toload, callback, delay) => {
  function getNext() {
    return toload.length > 0
         ? toload.shift()
         : false;
  }
  
  function loadNext() {
    const next = getNext();
    
    if (!next) {
      callback && setTimeout(callback, delay || 0);
      return;
    }
    
    const [ query, file ] = next;
    
    $(query).load(file, function(response, status, xhr) {
      if (status === 'error') {
        /* TODO: Handle Error, REROUTE TO HOMEPAGE */
        
        alert(`Sorry, but there was an Error while loading the page: ${xhr.status} ${xhr.statusText}`);
      }
      
      loadNext();
    });
  }
  
  loadNext();
};