Mathem.keys = []
Mathem.constants = []

;(function() {
  const keys = Mathem.keys
  const constants = Mathem.constants
  const { updateCalculation } = Mathem
  let shifting = false
  
  function bindConstant (keycodes, id, value, shiftRequired, isOperator) {
    const func = c => {
      if (c === '0') {
        return value
      }
      return c + value
    }
    
    $(`#key-${id}`).click(function() {
      updateCalculation(func, isOperator)
    })
    
    constants.push(value)
    keys.push({
      codes: typeof keycodes === Object ? keycodes : [keycodes],
      cb: func,
      shift: shiftRequired,
      value: value,
      operator: isOperator
    })
  }
  Mathem.bindConstant = bindConstant
  
  function bindFunction (keycodes, id, func, shiftRequired) {
    $(`#key-${id}`).click(function() {
      Mathem.calculate()
      Mathem.calculation = `${func}(${Mathem.calculation})`
      
      updateCalculation(Mathem.tryToCalculate)
    })
    
    keys.push({
      codes: typeof keycodes === Object ? keycodes : [keycodes],
      cb: func,
      shift: shiftRequired
    })
  }
  Mathem.bindFunction = bindFunction
  
  function bindUnrepeatableConstant (keycodes, id, value, notToRepeat, shiftRequired) {
    const nlen = notToRepeat.length
    const func = c => {
      const clen = c.length
      if (c.slice(clen - nlen, clen) === notToRepeat) {
        return c
      }
      return c + value
    }
    
    $(`#key-${id}`).click(function() {
      updateCalculation(func)
    })
    
    constants.push(value)
    keys.push({
      codes: typeof keycodes === Object ? keycodes : [keycodes],
      cb: func,
      value: value,
      shift: shiftRequired
    })
  }
  Mathem.bindUnrepeatableConstant = bindUnrepeatableConstant
  
  function keyUp (e) {
    if (e.which === 16) {
      shifting = false
    }
  }
  Mathem.keyUp = keyUp
  
  function deleteLast () {
    for (let constant of constants) {
      if (Mathem.deleteIfThere(constant)) {
        return
      }
    }
  }
  Mathem.delete = deleteLast
  
  function keyDown (e) {
    if (e.ctrlKey) {
      return
    }
    
    if (e.which === 16) {
      shifting = true
      return
    }
    
    const backspacing = e.which === 8 && shifting
    const pressingC = e.which === 67 && !shifting
    
    if (backspacing || pressingC) {
      Mathem.deleteAll()
    }
    
    if (e.which === 8) {
      deleteLast()
    }
    
    if (e.which === 13 || (e.which === 187 && !shifting)) {
      Mathem.calculate()
    }
    
    keys.forEach(key => {
      const { codes, cb, shift, operator } = key
      
      if (shift ? !shifting : shifting) {
        return
      }
      
      for (let code of codes) {
        if (e.which === code) {
          updateCalculation(cb, operator)
        }
      }
    })
  }
  Mathem.keyDown = keyDown
})()