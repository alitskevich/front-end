export function getter(k) {

    var i,l,r = this[k];
    if (r === i && (l=(k = k.split('.')).length) > 1) for (i=0,r = this; i < l && r; r = r[k[i++]]);
    return r;
}

export function functionName(fn) {

    return fn.displayName || (fn.displayName = fn.name || ((/^function\s+([\w\$]+)\s*\(/.exec(fn.toString()) || [])[1] || 'C'));
}

export function getStatic(t, key) {

    for (var r;t &&!r;t = t.__proto__) {
        r = t.constructor[key]
    }
    return r;
}