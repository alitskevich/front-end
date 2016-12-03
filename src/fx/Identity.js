

    function Identity(a) {
        return new Identity.fn.init(a)
    }
    root.Identity = Identity

    Identity.of = function (a) {
        return new Identity(a)
    }

    Identity.fn = Identity.prototype = {
        init(val) {
            this.val = val
        },
        bind(fn) {
            return fn(this.val)
        },
        get() {
            return this.val
        },
        equals(other) {
            return (isFunction(other.get) && equals(this.get())(other.get()))
        },
        toString() {
            return 'Identity(' + this.val + ')'
        },
        inspect() {
            return this.toString()
        }
    }

    Identity.fn.init.prototype = Identity.fn
