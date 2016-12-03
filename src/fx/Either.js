   /* Either Monad */

    var Either = root.Either = {}

    Either.of = function (a) {
        return Right(a)
    }

    var Right = Either.Right = root.Right = function (val) {
        return new Either.fn.init(val, true)
    }
    var Left = Either.Left = root.Left = function (val) {
        return new Either.fn.init(val, false)
    }

    Either.fn = Either.prototype = {
        init(val, isRightValue) {
            this.isRightValue = isRightValue
            this.value = val
        },
        bind(fn) {
            return this.isRightValue ? fn(this.value) : this
        },
        ap(eitherWithFn) {
            var self = this
            return this.isRightValue ? eitherWithFn.map(function (fn) {
                return fn(self.value)
            }) : this
        },
        leftMap(fn) {
            return this.isLeft() ? Left(fn(this.value)) : this
        },
        isRight() {
            return this.isRightValue
        },
        isLeft() {
            return !this.isRight()
        },
        right() {
            if (this.isRightValue) {
                return this.value
            } else {
                throw 'Illegal state. Cannot call right() on a Either.left'
            }
        },
        left() {
            if (this.isRightValue) {
                throw 'Illegal state. Cannot call left() on a Either.right'
            } else {
                return this.value
            }
        },
        cata(leftFn, rightFn) {
            return this.isRightValue ? rightFn(this.value) : leftFn(this.value)
        },
        equals(other) {
            if (!isFunction(other.isRight) || !isFunction(other.cata)) {
                return false
            }
            return this.cata(
                function (left) {
                    return other.cata(equals(left), falseFunction)
                },
                function (right) {
                    return other.cata(falseFunction, equals(right))
                }
            )
        },
        bimap(leftFn, rightFn) {
            return this.isRightValue ? this.map(rightFn) : this.leftMap(leftFn)
        },
        toMaybe() {
            return this.isRight() ? Some(this.value) : None()
        },
        toValidation() {
            return this.isRight() ? Success(this.value) : Fail(this.value)
        },
        toString() {
            return this.cata(
                function(left) { return 'Left(' + left + ')' },
                function(right) { return 'Right(' + right + ')' }
            )
        },
        inspect: function() {
            return this.toString()
        }
    }

    Either.fn.init.prototype = Either.fn
