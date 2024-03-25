export const floor = x => x < 0 ? x - x % 1 - 1 : x - x % 1;
export const abs = x => x < 0 ? -x : x;
export const min = (a, b) => a < b ? a : b;
export const max = (a, b) => a > b ? a : b;

export const square = x => x * x;
export const cube = x => x * x * x;