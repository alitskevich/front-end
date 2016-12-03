
    MonadT.of = function (m) {
        return MonadT(m)
    }

    MonadT.fn = MonadT.prototype = {
        init(monad) {
            this.monad = monad
        },
        map(fn) {
            return monadT(this.monad.map(function (v) {
                return v.map(fn)
            }))
        },
        bind(fn) {
            return monadT(this.monad.map(function (v) {
                return v.flatMap(fn)
            }))
        },
        ap(monadWithFn) {
            return monadT(this.monad.flatMap(function (v) {
                return monadWithFn.perform().map(function (v2) {
                    return v.ap(v2)
                })
            }))
        },
        perform() {
            return this.monad
        }
    }

    MonadT.fn.init.prototype = MonadT.fn



    var monadT, monadTransformer, MonadTransformer
    var MonadT = monadT = monadTransformer = MonadTransformer = root.monadTransformer = root.MonadT = root.monadT = function (monad) {
        return new MonadT.fn.init(monad)
    }



    // Add aliases

    function addAliases(type) {
        type.prototype.flatMap = type.prototype.chain = type.prototype.bind
        type.pure = type.unit = type.of
        type.prototype.of = type.of
        if (type.prototype.append != null) {
            type.prototype.concat = type.prototype.append
        }
        type.prototype.point = type.prototype.pure = type.prototype.unit = type.prototype.of
    }

    // Wire up aliases
    function addMonadOps(type) {
        type.prototype.join = function () {
            return this.flatMap(idFunction)
        }

        type.map2 = function (fn) {
            return function (ma, mb) {
                return ma.flatMap(function (a) {
                    return mb.map(function (b) {
                        return fn(a, b)
                    })
                })
            }
        }
    }

    function addFunctorOps(type) {
        if (type.prototype.map == null) {
            type.prototype.map = function (fn) {
                return map.call(this, fn)
            }
        }
    }

    function addApplicativeOps(type) {
        type.prototype.takeLeft = function (m) {
            return apply2(this, m, function (a, b) {
                return a
            })
        }

        type.prototype.takeRight = function (m) {
            return apply2(this, m, function (a, b) {
                return b
            })
        }
    }

    function decorate(type) {
        addAliases(type)
        addMonadOps(type)
        addFunctorOps(type)
        addApplicativeOps(type)
    }

    decorate(MonadT)
    decorate(Either)
    decorate(Maybe)
    decorate(IO)
    decorate(NEL)
    decorate(List)
    decorate(Validation)
    decorate(Reader)
    decorate(Free)
    decorate(Identity)
