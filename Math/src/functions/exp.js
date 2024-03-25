export const exp = x =>
{
  if (x < 0)
  {
    return 1 / exp(-x);
  }
  
  if (x > 0.01)
  {
    const r = exp(x / 2);
    return r * r;
  }
  
  const a = x * x / 2;
  const b = a * x / 3;
  const c = b * x / 4;
  return 1 + x + a + b + c * (1 + x / 5);
};
