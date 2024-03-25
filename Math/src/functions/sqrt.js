export const sqrt = (() =>
{
  const buf = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT);
  const fv = new Float32Array(buf);
  const lv = new Uint32Array(buf);
  
  return n =>
  {
    let m = 1;
    
    while (n > 10E32)
    {
      m *= 31622776601683790;
      n /= 10E32;
    }
    
    const half = n * 0.5;
    
    fv[0] = n;
    lv[0] = 0x5f3759df - (lv[0] >> 1);
    
    let y = fv[0];
    
    y = y * (1.5 - (half * y * y));
    y = y * (1.5 - (half * y * y));
    y = y * (1.5 - (half * y * y));
    y = y * (1.5 - (half * y * y));
    y = y * (1.5 - (half * y * y));
    
    return m / y;
  };
})();
