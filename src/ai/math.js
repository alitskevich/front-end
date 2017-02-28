
export const random = () => Math.random();

export const plus = (a, b) => a + b;

export const incProperty = (o, n, d = 0) => (o[n] = (o[n] || 0) + d);

export const sum = (arr, bias = 0) => arr.reduce(plus, bias);

export const mean = (grades) => sum(grades) / grades.length;

export const sigmoid = x => 1 / (1 + Math.exp(-x));

export const multiplyVectors = (a, b, bias = 0) =>
  Object.keys(a).map(key => a[key] * (b[key] || 0) ).reduce(plus, bias);

export const incProperties = (target, source) =>
  Object.keys(source).map(key => incProperty(target, key, source[key]));
