;(function() {
  const {
    bindConstant,
    bindUnrepeatableConstant,
    bindFunction
  } = Mathem
  
  bindConstant(57, 'left-bracket', ' (', true)
  bindConstant(48, 'right-bracket', ') ', true)
  
  bindConstant(48, 'zero', '0')
  bindConstant(49, 'one', '1')
  bindConstant(50, 'two', '2')
  bindConstant(51, 'three', '3')
  bindConstant(52, 'four', '4')
  bindConstant(53, 'five', '5')
  bindConstant(54, 'six', '6')
  bindConstant(55, 'seven', '7')
  bindConstant(56, 'eight', '8')
  bindConstant(57, 'nine', '9')
  bindConstant(65, 'ANS', 'ANS')
  
  bindConstant(191, 'divide', ' / ', false, true)
  bindConstant(56, 'multiply', ' * ', true, true)
  bindConstant(187, 'add', ' + ', true, true)
  bindConstant(189, 'subtract', ' - ', false, true)
  
  bindConstant(null, 'asin', 'asin(')
  bindConstant(null, 'acos', 'acos(')
  bindConstant(null, 'atan', 'atan(')
  bindConstant(null, 'sin', 'sin(')
  bindConstant(null, 'cos', 'cos(')
  bindConstant(null, 'tan', 'tan(')
  bindConstant(null, 'sinh', 'sinh(')
  bindConstant(null, 'cosh', 'cosh(')
  
  bindConstant(76, 'log', 'log(')
  bindConstant(54, 'power', ' ^ ', true, true)
  bindConstant(83, 'square', ' ^ 2', false, true)
  bindConstant(82, 'sqrt', 'sqrt(')
  
  bindConstant(80, 'pi', 'PI')
  bindConstant(69, 'e', 'e')
  bindConstant(73, 'i', 'i')
  
  bindConstant(null, null, 'Infinity')
  bindConstant(null, null, 'NaN')
  
  bindUnrepeatableConstant(190, 'dot', '.', '.', false)
  bindUnrepeatableConstant(null, 'zerozero', '00', '0', false)
  
  bindFunction(null, 'plusminus', '-', false)
})()