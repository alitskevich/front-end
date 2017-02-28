function assign(target, src) {

    Object.keys(src).forEach(key => target[key] = unBind(src[key]));
}

export function createAlgebra(name, ops, factory) {

    const algebra = function (options) {
        Object.assign(this, options, ops.init && ops.init(this) || {});
    };

    const proto = algebra.prototype;

    algebra.of = proto.of = factory || (a => new algebra(a));

    assign(proto, {
        toString:($) =>`${name}(${$.valueOf()})`,
        compose: ($, ...fnn) => arg => fnn.reduce((r, fn)=>(isFunction(fn) ? fn : $[fn]).call($, r), arg),
        inspect: ($) => $.toString(),
        valueOf: ($) => $.value
    });

    assign(proto, ops);

    return algebra;

}
