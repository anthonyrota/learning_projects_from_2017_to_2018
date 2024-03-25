export function random(a, b) {
  return Math.random() * (b - a) + a;
}

export function randomInt(a, b) {
  return Math.floor(random(a, b + 1));
}

export function format(number, suffix = '') {
  return number === Math.floor(number) ? number + suffix : number.toFixed(3) + suffix;
}

export function storeDefault(name, value) {
  if (!store.get(name)) {
    store.set(name, value);
  }
}

function nf(n, exp) {
  const p = Math.pow(10, exp);
  return Math.floor(p * n) / p;
}

export function shortenNumber(n) {
  if (n > 1000000000) {
    return nf(n / 1000000000, 3) + 'B';
  }
  
  if (n > 1000000) {
    return nf(n / 1000000, 3) + 'm';
  }
  
  if (n > 1000) {
    return nf(n / 1000, 2) + 'k';
  }
  
  return n;
}
