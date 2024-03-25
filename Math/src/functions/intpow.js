export const intpow = (a, b) =>
{
  let r = 1;
  
  while (b)
  {
    if (b & 1)
    {
      r *= a;
    }
    b >>= 1;
    a *= a;
  }
  
  return r;
};
