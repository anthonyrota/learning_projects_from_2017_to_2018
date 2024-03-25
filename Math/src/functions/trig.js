import { PI, PI2, PI_2 } from '../constants.js';

export const sin = (() =>
{
  const m = 5 * PI * PI;
  
  return x =>
  {
    if (x < 0)
    {
      return -sin(-x);
    }
    const z = x % PI;
    const k = z * (PI - z);
    const t = (16 * k) / (m - 4 * k);
    return x % PI2 < PI ? t : -t;
  };
})();

export const cos = x => sin(PI_2 + x);
export const tan = x => sin(x) / cos(x);

export const csc = x => 1 / sin(x);
export const sec = x => 1 / cos(x);
export const cot = x => 1 / tan(x);
