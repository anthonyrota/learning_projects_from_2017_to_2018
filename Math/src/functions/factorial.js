import { floor } from './snippets.js';
import { gamma } from './gamma.js';

export const factorial = (() =>
{
  const memo = [0, 1];
  let s = 1;
  
  for (let i = 2; i < 100; i++)
  {
    s *= i;
    memo[i] = s;
  }
  
  return x => x === floor(x) && x >= 0 ? (memo[x] || Infinity) : gamma(x + 1);
})();
