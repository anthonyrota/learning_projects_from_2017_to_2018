import { floor, abs } from './snippets.js';

export const fibonacci = (() =>
{
  const memo = [0, 1];
  
  for (let i = 2; i < 10000; i++)
  {
    memo[i] = memo[i - 1] + memo[i - 2];
  }
  
  return x =>
  {
    const ans = memo[floor(abs(x))];
    return typeof ans !== 'undefined' ? ans : Infinity;
  };
})();
