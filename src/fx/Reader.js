
 
    function wrapReader(fn, args) {
        args = args || []
        return function () {
            var args1 = args.concat(getArgs(arguments))
            var self = this
            return args1.length + 1 >= fn.length ?
                Reader(function (c) {
                    return fn.apply(self, args1.concat(c))
                }) :
                wrapReader(fn, args1)
        }
    }

    var reader
    var Reader = reader = root.Reader = function (fn) {
        return new Reader.fn.init(fn)
    }

    Reader.of = function (x) {
        return Reader(function (_ /* do not remove - it's for currying purposes */) {
            return x
        })
    }

    Reader.ask = function () {
        return Reader(idFunction)
    }

    Reader.fn = Reader.prototype = {
        init(fn) {
            this.f = fn
        },
        run(config) {
            return this.f(config)
        },
        bind(fn) {
            var self = this
            return Reader(function (config) {
                return fn(self.run(config)).run(config)
            })
        },
        ap(readerWithFn) {
            var self = this
            return readerWithFn.bind(function (fn) {
                return Reader(function (config) {
                    return fn(self.run(config))
                })
            })
        },
        map(fn) {
            var self = this
            return Reader(function (config) {
                return fn(self.run(config))
            })
        },
        local(fn) {
            var self = this
            return Reader(function (c) {
                return self.run(fn(c))
            })
        }
    }

    Reader.fn.init.prototype = Reader.fn
