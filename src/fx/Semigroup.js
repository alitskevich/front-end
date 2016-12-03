var Semigroup = root.Semigroup = {}

Semigroup.append = function (a, b) {
    if (isArray(a)) {
        return a.concat(b)
    }
    if (typeof a === 'string') {
        return a + b
    }
    if (isFunction(a.concat)) {
        return a.concat(b)
    }
    throw 'Couldn\'t find a semigroup appender in the environment, please specify your own append function'
}