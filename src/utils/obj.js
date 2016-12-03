export const isObject = (o)=> (o && typeof o ==='object');

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