;(function() {
  let replacements = {}
  let config = {
    angles: 'deg'
  }
  
  ;['sin', 'cos', 'tan', 'sec', 'cot', 'csc'].forEach(function(name) {
    const fn = math[name]
    
    function fnNumber (x) {
      if (config.angles === 'deg') {
        return Math.round(fn(x / 180 * Math.PI) * 10E8) / 10E8
      }
      
      return Math.round(fn(x) * 10E8) / 10E8
    }
    
    replacements[name] = math.typed(name , {
      'number': fnNumber,
      'Array | Matrix': function (x) {
        return math.map(x, fnNumber)
      }
    })
  })

  ;['asin', 'acos', 'atan', 'atan2', 'acot', 'acsc', 'asec'].forEach(function(name) {
    const fn = math[name]

    function fnNumber (x) {
      var result = fn(x)

      if (typeof result === 'number' && config.angles === 'deg') {
        return result / Math.PI * 180
      }

      return result
    }
    
    replacements[name] = math.typed(name, {
      'number': fnNumber,
      'Array | Matrix': function (x) {
        return math.map(x, fnNumber)
      }
    })
  })

  math.import(replacements, { override: true })
  
  $('#key-deg').click(() => config.angles = 'deg')
  $('#key-rad').click(() => config.angles = 'rad')
})()
