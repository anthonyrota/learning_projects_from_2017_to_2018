if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    'use strict';
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if (count != count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (var i = 0; i < count; i++) {
      rpt += str;
    }
    return rpt;
  }
}

Mathem.calculation = ''
Mathem.prevAnswer = 0
Mathem.lastCalculation = ''
Mathem.justCalculated = false

Mathem.mainOutput = $('.outputs .main-output')

;(function() {
  function isLastPartOfCalculation (val) {
    const { calculation } = Mathem
    const mlen = Mathem.calculation.length
    const vlen = val.length
    const diff = mlen - vlen
    if (calculation.slice(diff, mlen) === val) {
      return true
    }
    return false
  }
  Mathem.isLastPartOfCalculation = isLastPartOfCalculation

  function generateCalculationString (c) {
    function replaceAll(s, o, n) {
      return s.split(o).join(n)
    }
    
    c = replaceAll(c, '*', '&times;')
    c = replaceAll(c, '/', '&divide;')
    c = replaceAll(c, 'PI', '&pi;')
    c = replaceAll(c, 'sqrt(', '&#8730;')
    
    return c
  }
  
  function updateCalculation (cb, isOperator) {
    for (let key of Mathem.keys) {
      if (key.value && key.operator && isOperator) {
        if (isLastPartOfCalculation(key.value)) {
          return false
        }
      }
    }
    
    if (isOperator && Mathem.justCalculated) {
      Mathem.calculation = cb('ANS')
    } else {
      Mathem.calculation = cb(Mathem.justCalculated ? '' : Mathem.calculation)
    }
    
    let c = generateCalculationString(String(Mathem.calculation))
    
    Mathem.mainOutput.html(c !== '' ? c : '...type input here')
    
    Mathem.justCalculated = false
  }
  Mathem.updateCalculation = updateCalculation
  
  function deleteIfThere (val) {
    const { calculation } = Mathem
    const mlen = Mathem.calculation.length
    const vlen = val.length
    const diff = mlen - vlen
    if (calculation.slice(diff, mlen) === val) {
      updateCalculation(c => c.slice(0, diff))
      return true
    }
    return false
  }
  Mathem.deleteIfThere = deleteIfThere
  
  function deleteAll () {
    updateCalculation(() => '')
    Mathem.prevAnswer = 0
    
    $('.previous-outputs').empty()
  }
  Mathem.deleteAll = deleteAll
  
  function tryToCalculate () {
    const scope = {
      ANS: Mathem.prevAnswer
    }
    
    try {
      const node = math.parse(Mathem.calculation, scope)
      const code = node.compile()
      
      Mathem.calculation = code.eval(scope)
    } catch (e) {
      Mathem.calculation = ''
      
      $('.error-message').addClass('visible')
      setTimeout(function() {
        $('.error-message').removeClass('visible')
      }, 4000)
    }
  }
  Mathem.tryToCalculate = tryToCalculate
  
  function calculate () {
    if (Mathem.justCalculated) {
      Mathem.calculation = Mathem.lastCalculation
    }
    
    let c = String(Mathem.calculation)
    Mathem.lastCalculation = c
    
    let nLeftBrackets = c.split('(').length - 1
    let nRighBrackets = c.split(')').length - 1
    
    if (nLeftBrackets > nRighBrackets) {
      Mathem.calculation += ')'.repeat(nLeftBrackets - nRighBrackets)
    }
    
    let s = generateCalculationString(String(c))
    
    if (c !== '') {
      $(`<span>${s}</span>`).appendTo('.previous-outputs')
    }
    
    tryToCalculate()
    
    if (Mathem.calculation === undefined) {
      Mathem.calculation = NaN
    }
    
    Mathem.prevAnswer = Mathem.calculation
    
    Mathem.updateCalculation(() => String(Mathem.calculation))
    
    Mathem.justCalculated = true
  }
  Mathem.calculate = calculate
})()