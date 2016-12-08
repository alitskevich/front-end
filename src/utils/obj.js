
export const isObject = (o)=> (o && typeof o ==='object');

export const undefOrNull = (o)  => o == null;

export function getter(k) {

    var i,l,r = this[k];
    if (r === i && (l=(k = k.split('.')).length) > 1) for (i=0,r = this; i < l && r; r = r[k[i++]]);
    return r;
}


export function getStatic(t, key) {

    for (var r;t &&!r;t = t.__proto__) {
        r = t.constructor[key]
    }
    return r;
}

export function objId(x) {

  return x ? x.id : null;
}

export function intoMethod(f) { return function (...args) { return f.apply(this, [this, ...args]) } };


/**
 * Maps by object keys.
 * Nullable items excluded from result.
 * @param x source object
 * @param fn function to produce item
 * @returns {Array} of mapped items
 */
export function each(x, fn = (key, value) => ({ key, value })) {

  if (x) {
    Object.keys(x).forEach((key, index) => fn(key, x[ key ], index));
  }

  return x;
}

export function map(x, fn = (key, value) => ({ key, value })) {

  const result = [];

  if (!x) {
    return result;
  }

  Object.keys(x).forEach(key => {
    const value = fn(key, x[ key ]);

    if (!undefOrNull(value)) {
      result.push(value);
    }
  });

  return result;
}

/*
  [e,...] => { [fnKey(e)]: fnValue(e), ...}
*/
export function objFromArray(arr, fnKey = noop, fnValue = noop) {

  const result = {};

  if (!arr) {
    return result;
  }
  for (let e of arr) {
    const key = fnKey(e);
    const value = fnValue(e);
    if (!undefOrNull(key) && !undefOrNull(value)) {
      result[key] = value;
    }
  }

  return result;
}

export function append(a, b) {
  
    if (isFunction(a.concat)) {
        return a.concat(b)
    }

    return a + b;
}
