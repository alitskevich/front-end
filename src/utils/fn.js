
const _curry = (fn, args0, lengthLimit) => {
    
    if (args0.length >= lengthLimit) {
        
        return (...args) => fn(...args0, ...args);
    }
    
    const fx = (args) => args.length >= lengthLimit ? fn(...args) : _curry(fn, args, lengthLimit - args.length);
    fx._length = lengthLimit;
    
    return  (...args) => fx([...args0, ...args])
};

export const isFunction = f => !!(f && f.constructor && f.call && f.apply);

export const functionDisplayName = f => f.displayName || (f.displayName = f.name || ((/^function\s+([\w\$]+)\s*\(/.exec(f.toString()) || [])[1] || 'C'));

export function fnVoid() {};

export function fnThis() { return this };

export function fnThrow(error) { throw new Error(error) };

export const fnId = x => x;

export const fnYes = () => true;

export const fnNo = () => false;

export const compose = (...ff) => x0 => ff.reduceRight((x, f) => f(x), x0);

export const swap = f => (a, b) => f(b, a);

export const curry = (f, ...args) => _curry(f, ...args, f._length || f.length);

export const assert = (b, error) => b || fnThrow(error);