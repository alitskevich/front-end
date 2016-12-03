
    var Free = root.Free = {}

    var Suspend = Free.Suspend = root.Suspend = function (functor) {
        return new Free.fn.init(functor, true)
    }
    var Return = Free.Return = root.Return = function (val) {
        return new Free.fn.init(val, false)
    }

    Free.of = function (a) {
        return Return(a)
    }

    Free.liftF = function (functor) {
        return isFunction(functor) ?
            Suspend(compose(Return, functor)) :
            Suspend(functor.map(Return))
    }

    Free.fn = Free.prototype = {
        init(val, isSuspend) {
            this.isSuspend = isSuspend
            if (isSuspend) {
                this.functor = val
            } else {
                this.val = val
            }
        },
        run() {
            return this.go(function (f) {
                return f()
            })
        },
        bind(fn) {

            return this.isSuspend ?

                isFunction(this.functor) ?

                    Suspend(compose(function (free) {
                        return free.bind(fn)
                    }, this.functor)) :

                    Suspend(this.functor.map(function (free) {
                        return free.bind(fn)
                    })) :

                fn(this.val)
        },
        ap(ff) {
            return this.bind(function (x) {
                return ff.map(function (f) {
                    return f(x)
                })
            })
        },

        resume() {
            return this.isSuspend ? Left(this.functor) : Right(this.val)
        },

        go1(f) {
            function go2(t) {
                return t.resume().cata(function (functor) {
                    return go2(f(functor))
                }, idFunction)
            }

            return go2(this)
        },
        go(f) {
            var result = this.resume()
            while (result.isLeft()) {
                var next = f(result.left())
                result = next.resume()
            }

            return result.right()
        }

    }

    Free.fn.init.prototype = Free.fn

