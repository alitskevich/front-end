    var io
    var IO = io = root.IO = root.io = function (effectFn) {
        return new IO.fn.init(effectFn)
    }

    IO.of = function (a) {
        return IO(function () {
            return a
        })
    }

    IO.fn = IO.prototype = {
        init(effectFn) {
            if (!isFunction(effectFn))
                throw 'IO requires a function'
            this.effectFn = effectFn
        },
        map(fn) {
            var self = this
            return IO(function () {
                return fn(self.effectFn())
            })
        },
        bind(fn) {
            var self = this
            return IO(function () {
                return fn(self.effectFn()).run()
            })
        },
        ap(ioWithFn) {
            var self = this
            return ioWithFn.map(function (fn) {
                return fn(self.effectFn())
            })
        },
        run() {
            return this.effectFn()
        }
    }

    IO.fn.init.prototype = IO.fn

    IO.prototype.perform = IO.prototype.performUnsafeIO = IO.prototype.run
