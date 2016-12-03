
    var Validation = root.Validation = {}

    var Success = Validation.Success = Validation.success = root.Success = function (val) {
        return new Validation.fn.init(val, true)
    }

    var Fail = Validation.Fail = Validation.fail = root.Fail = function (error) {
        return new Validation.fn.init(error, false)
    }

    Validation.of = function (v) {
        return Success(v)
    }

    Validation.fn = Validation.prototype = {
        init(val, success) {
            this.val = val
            this.isSuccessValue = success
        },
        success() {
            if (this.isSuccess())
                return this.val
            else
                throw 'Illegal state. Cannot call success() on a Validation.fail'
        },
        isSuccess() {
            return this.isSuccessValue
        },
        isFail() {
            return !this.isSuccessValue
        },
        fail() {
            if (this.isSuccess())
                throw 'Illegal state. Cannot call fail() on a Validation.success'
            else
                return this.val
        },
        bind(fn) {
            return this.isSuccess() ? fn(this.val) : this
        },
        ap(validationWithFn) {
            var value = this.val
            return this.isSuccess() ?
                validationWithFn.map(function (fn) {
                    return fn(value)
                })
                :
                (validationWithFn.isFail() ?
                    Validation.Fail(Semigroup.append(value, validationWithFn.fail()))
                    : this)
        },
        acc() {
            var x = function () {
                return x
            }
            return this.isSuccessValue ? Validation.success(x) : this
        },
        cata(fail, success) {
            return this.isSuccessValue ?
                success(this.val)
                : fail(this.val)
        },
        failMap(fn) {
            return this.isFail() ? Fail(fn(this.val)) : this
        },
        bimap(fail, success) {
            return this.isSuccessValue ? this.map(success) : this.failMap(fail)
        },
        equals(other) {
            return this.cata(
                function (fail) {
                    return other.cata(equals(fail), falseFunction)
                },
                function (success) {
                    return other.cata(falseFunction, equals(success))
                }
            )
        },
        toMaybe() {
            return this.isSuccess() ? Some(this.val) : None()
        },
        toEither() {
            return (this.isSuccess() ? Right : Left)(this.val)
        },
        toString() {
            return (this.isSuccess() ? 'Success(' : 'Fail(') + this.val + ')'
        },
        inspect() {
          return this.toString()
        }
    }

    Validation.fn.init.prototype = Validation.fn
