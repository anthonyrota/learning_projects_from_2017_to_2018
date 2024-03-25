import { sqrt } from './sqrt.js';

export function hypot2(/* numbers */)
{
  let n = arguments;
  let l = n.length;
  let sum = 0;
  for (let i = 0; i < l; i++)
  {
    sum += n[i] * n[i];
  }
  return sum;
}

export function hypot(/* numbers */)
{
  return sqrt(hypot2.apply(null, arguments));
}
