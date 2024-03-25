window.bindColorInput = function($el, cb) {
  const isValidRegex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
  
  $el.val('#fff');
  
  function fixColor(c) {
    // is valid color
    if (isValidRegex.test(c)) {
      return c;
    }
    
    // length is zero - empty string
    if (c.length === 0) {
      return '#fff';
    }
    
    // does not begin with '#', might me valid color still
    if (c.charAt(0) !== '#') {
      return fixColor('#' + c);
    }
    
    // length is less than four, so can't be valid color
    if (c.length <= 4) {
      return '#fff';
    }
    
    // if length is greater than 7, then reiterate and see if
    // the first 7 characters are valid
    // eg. #2871279 => #287127
    if (c.length > 7) {
      return fixColor(c.slice(0, 7));
    }
    
    // the length is greater than 4 but less than 8 so
    // see if the first 4 characters are valid
    // eg. #2288 => #228
    return fixColor(c.slice(0, 4));
  }
  
  $el.on('blur', function(e) {
    const $this = $(this);
    let val = fixColor($this.val());
    
    $this.val(val);
    
    cb && cb(val, window.hexToDecimal(val));
  });
};

window.hexToDecimal = function(hex) {
  const shortHexRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  
  hex = hex.replace(shortHexRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return result ? 256 * 256 * r + 256 * g + b : 0;
};