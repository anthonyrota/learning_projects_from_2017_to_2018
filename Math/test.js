import math from './src/index.js';

window.math = math;

const namespace = (str, ns) => {
  ns = ns + '.';
  let s = String(str), m, re = /[a-zA-Z]\w*/g, a = 0, i;
  while ((m = re.exec(str)) !== null) {
    i = m.index;
    if (m[0] === 'x' || (i > 0 && /\d/.test(str.slice(i - 1, i)))) continue;
    s = s.slice(0, i + a) + ns + s.slice(i + a);
    a += ns.length;
  }
  return s;
};

const $ = q => document.getElementById(q);
const hide = q => q.style.display = 'none';
const show = q => q.style.display = 'block';

Math.ln = Math.log;
Math.log = (a, b) => Math.ln(a) / Math.ln(b);

Math.cos = x => Math.sin(Math.PI / 2 + x);
Math.tan = x => Math.sin(x) / Math.cos(x);

Math.csc = x => 1 / Math.sin(x);
Math.sec = x => 1 / Math.cos(x);
Math.cot = x => 1 / Math.tan(x);

Math.e = Math.E;
Math.pi = Math.PI;

window.$ = $;

const input = $('input');
const output1 = $('output1');
const output2 = $('output2');
const output3 = $('output3');

input.addEventListener('input', () => {
  try {
    output1.innerHTML = eval(namespace(input.value, 'math'));
  } catch (e) {
    output1.innerHTML = 'error';
  }
  
  try {
    output2.innerHTML = eval(namespace(input.value, 'Math'));
  } catch (e) {
    output2.innerHTML = 'error';
  }
  
  try {
    const a = eval(namespace(input.value, 'math'));
    const b = eval(namespace(input.value, 'Math'));
    
    output3.innerHTML = ((a / b - 1) * 100).toFixed(16) + '%';
  } catch (e) {
    output3.innerHTML = 'error';
  }
});

const calculatorSwitch = $('switch--calculator');
const graphSwitch = $('switch--graph');
const errorSwitch = $('switch--error');
const form = $('form');
const chart = $('chart');
const gobtn = $('go');
const func = $('function');

hide(form);
show(chart);

calculatorSwitch.addEventListener('click', () => {
  graphSwitch.classList.remove('active');
  errorSwitch.classList.remove('active');
  calculatorSwitch.classList.add('active');
  hide(chart);
  show(form);
});

graphSwitch.addEventListener('click', () => {
  calculatorSwitch.classList.remove('active');
  errorSwitch.classList.remove('active');
  graphSwitch.classList.add('active');
  hide(form);
  show(chart);
});

errorSwitch.addEventListener('click', () => {
  calculatorSwitch.classList.remove('active');
  graphSwitch.classList.remove('active');
  errorSwitch.classList.add('active');
  hide(form);
  show(chart);
});

gobtn.addEventListener('click', () => {
  calculatorSwitch.classList.remove('active');
  graphSwitch.classList.remove('active');
  hide(form);
  hide(chart);
  generate(errorSwitch.classList.contains('active'));
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
resize();

window.addEventListener('resize', resize);

const generateDataset = (borderWidth, f, label, color, step, min, max, ...args) => {
  const data = {
    label: label,
    borderColor: color,
    borderWidth,
    radius: 0,
    lineTension: 0,
    data: []
  };
  
  for (let x = min; x < max; x += step) {
    try {
      data.data.push(f(...args, x));
    } catch (e) {
      data.data.push(0);
    }
  }
  
  return data;
};

const generateLabels = (step, min, max) => {
  const labels = [];
  for (let x = min; x < max; x += step) {
    labels.push(x);
  }
  return labels;
};

const minInput = $('min');
const maxInput = $('max');

let prevChart;

const generate = (isRelative) => {
  try {
    const fn = namespace(func.value, 'math');
    const f = new Function('math', 'x', `return (${fn})`);
    
    const min = Number(minInput.value);
    const max = Number(maxInput.value);
    const step = (max - min) / 1000;
    
    const labels = generateLabels(step, min, max);
    
    const a = generateDataset(10, f, 'Custom Math', '#2ecc71', step, min, max, math);
    const b = generateDataset(4, f, 'Built In Math', '#e74c3c', step, min, max, Math);
    
    const fn2 = namespace(func.value, 'Math');
    const rf = new Function('math', 'Math', 'x', `
      const a = ${fn};
      const b = ${fn2};
      return ((a / (b === 0 ? a : b)) - 1) * 100
    `);
    
    const re = generateDataset(4, rf, 'Relative Error %', '#0f0', step, min, max, math, Math);
    
    if (prevChart) {
      prevChart.destroy();
    }
    
    prevChart = new Chart(ctx, {
      type: 'line',
      
      data: {
        labels,
        datasets: isRelative ? [re] : [b, a]
      },
      
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        title: {
          display: true,
          text: func.value
        }
      }
    });
  } catch (e) {
    swal('OOPS!', 'An error occured', 'error');
    throw e;
  }
};
