import { sin } from './trig.js';
import { pow } from './pow.js';
import { exp } from './exp.js';

export const gamma = (() =>
{
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  
  return x =>
  {
    if (x < 0.5)
    {
      return PI / (sin(PI * x) * gamma(1 - x));
    }
    
    x -= 1;
    
    let a = p[0];
    const t = x + 7.5;
    
    for (let i = 1; i < p.length; i++)
    {
      a += p[i] / (x + i);
    }
    
    return 2.5066282746310002 * pow(t, x + 0.5) * exp(-t) * a;
  };
})();
