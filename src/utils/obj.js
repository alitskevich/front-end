/* eslint no-cond-assign: "off" */
/* eslint no-eq-null: "off" */

import { fnId } from './fn.js';

export const isObject = (o)=> (o && typeof o === 'object');

export const undefOrNull = (o) => o == null;

export function objId(x) {

  return x ? x.id : null;
}

export function intoMethod(f) { return function (...args) { return f.apply(this, [this, ...args]); }; }

/**
 * Maps by object keys.
 * Nullable items excluded from result.
 * @param x source object
 * @param fn function to produce item
 * @returns {Array} of mapped items
 */
export function objForEach(x, fn) {

  if (x && fn) {
    Object.keys(x).forEach((key, index) => fn(x[ key ], key, index));
  }

  return x;
}

export function objMap(x, fn = (value, key) => ({ value, key })) {

  const result = {};

  if (!x) {
    return result;
  }

  Object.keys(x).forEach(key => {
    const value = fn(x[ key ], key);

    if (value != null) {
      result[key] = value;
    }
  });

  return result;
}

export function objToArray(x, fn = (value, key) => ({ value, key })) {

  const result = [];

  if (!x) {
    return result;
  }

  Object.keys(x).forEach(key => {
    const value = fn(x[ key ], key);

    if (value != null) {
      result.push(value);
    }
  });

  return result;
}

/*
  [e,...] => { [fnKey(e)]: fnValue(e), ...}
*/
export function objFromArray(arr, fnKey = fnId, fnValue = fnId) {

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

    if (a.concat) {
        return a.concat(b);
    }

    return a + b;
}

export function objGet(x, key) {

  return (x && key) ? getter.call(x, key) : Object.undefined;
}

export function getter(k) {

    let r = this[k], arr, l;

    if (r === arr && (l = (arr = k.split('.')).length) > 1) {

      r = this[arr[0]];
      for (let i = 1; i < l; r = r[arr[i++]]) {
        if (!r) {
          return Object.undefined;
        }
      }
    }

    return r;
}

// overrides methods with super.
Object.mixin = (target, fn, ...params) =>{
    const _super = {};
    const mix = fn && fn.apply(null, [_super].concat(params)) || {};
    Object.keys(mix).forEach((n) => {
        const f = target[n];
        _super[n] = (ctx, ...args)=>(f && f.apply(ctx, args));
        target[n] = mix[n];
    });
    return target;
};
