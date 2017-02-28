/* eslint no-console: 0 */

const undef = Object.undefined;

const _curry = (fn, args0, lengthLimit) => {

  const fx = (args) => args.length >= lengthLimit ?
    fn(...args) :
    _curry(fn, args, lengthLimit - args.length);

  return (...args) => fx([...args0, ...args]);
};

export const isFunction = f => !!(f && f.constructor && f.call && f.apply);

export const functionDisplayName = f => f.displayName || (f.displayName = f.name || ((/^function\s+([\w\$]+)\s*\(/.exec(f.toString()) || [])[1] || 'C'));
export const log = (...args) =>{ console.log(...args); return args[args.length - 1]; };

export function fnVoid() {}
export function fnThis() { return this; }
export function fnThisProp(key) { return this[key]; }
export function fnThrow(error, ErrorType = Error) { throw new ErrorType(error); }

export const fnId = x => x;

export const fnNull = x => null;

export const fnTrue = () => true;

export const fnFalse = () => false;

export const compose = (...ff) => x0 => ff.reduceRight((x, f) => f(x), x0);

export const swap = f => (a, b) => f(b, a);

export const isSomething = (a) => a !== undef && a !== null;
export const someOrNull = (a) => a === undef || a === null ? null : a;

export const sum = (a, b) => a + b;
export const and = (a, b) => a && b;
export const or = (a, b) => a || b;

export const curry = (f, ...args) => _curry(f, args, f.length);

export const assert = (b, error, errorType) => b || fnThrow(error, errorType);
