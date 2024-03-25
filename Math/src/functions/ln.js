export const ln = x =>
{
  let a = 0;
  
  if (x < 0.8)
  {
    if (x < 0.241 && x > 0)
    {
      return ln(4.98 * x) - 1.6054298910365616;
    }
    else if (x < 0.361)
    {
      x *= 3.325;
      a = 1.2014696741078175;
    }
    else if (x < 0.54)
    {
      x *= 2.22;
      a = 0.7975071958841766;
    }
    else if (x !== 0)
    {
      x *= 1.5;
      a = 0.4054651081081572;
    }
    else
    {
      return -Infinity;
    }
  }
  else if (x > 1.2)
  {
    return -ln(1 / x);
  }
  
  const k = x - 1;
  let m = k;
  let s = k;
  
  for (let i = 2; i < 18; i++)
  {
    m *= k;
    s += i & 1 ? m / i : -m / i;
  }
  
  return s - a;
};

export const log = (a, b) => ln(a) / ln(b);
