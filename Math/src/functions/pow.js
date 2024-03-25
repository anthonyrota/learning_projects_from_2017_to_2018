import { exp } from './exp.js';
import { ln } from './ln.js';
import { intpow } from './intpow.js';
import { floor } from './snippets.js';

export const pow = (a, b) =>
{
  if (b === floor(b))
  {
    return intpow(a, b);
  }
  
  return exp(b * ln(a));
};
