
    /* Maybe Monad */

    var Just
    var Some = Just = Maybe.Just = Maybe.Some = root.Some = root.Just = function (val) {
        return new Maybe.fn.init(true, val)
    }

    var Nothing
    var None = Nothing = Maybe.Nothing = Maybe.None = root.None = function () {
        return new Maybe.fn.init(false, null)
    }
    
  class Maybe extends Monad {
  
    static fromNull(val) {
        return val == null ? Maybe.None() : Maybe.Some(val)
    }

    static Maybe.of(a) {
        return Some(a)
    }
    
    static toList(maybe) {
        return maybe.toList()
    }

    init: function (isValue, val) {
        this.isValue = isValue
        if (val == null && isValue) {
            throw 'Illegal state exception'
        }
        this.val = val
    },
    isSome: function () {
        return this.isValue
    },
    isNone: function () {
        return !this.isSome()
    },
    bind: function (bindFn) {
        return this.isValue ? bindFn(this.val) : this
    },
    some: function () {
        if (this.isValue) {
            return this.val
        } else {
            throw 'Illegal state exception'
        }
    },
    orSome: function (otherValue) {
        return this.isValue ? this.val : otherValue
    },
    orElse: function (maybe) {
        return this.isValue ? this : maybe
    },
    ap: function (maybeWithFunction) {
        var value = this.val
        return this.isValue ? maybeWithFunction.map(function (fn) {
            return fn(value)
        }) : this
    },
    equals: function (other) {
        if (!isFunction(other.isNone) || !isFunction(other.map)) {
            return false
        }
        if (this.isNone()) {
            return other.isNone()
        }
        return this.ap(other.map(equals)).orElse(false)
    },

    toList: function () {
        return this.map(List).orSome(Nil)
    },
    toEither: function (failVal) {
        return this.isSome() ? Right(this.val) : Left(failVal)
    },
    toValidation: function (failVal) {
        return this.isSome() ? Success(this.val) : Fail(failVal)
    },
    fold: function (defaultValue) {
        var self = this
        return function (fn) {
            return self.isSome() ? fn(self.val) : defaultValue
        }
    },
    cata: function (none, some) {
        return this.isSome() ? some(this.val) : none()
    },
    filter: function (fn) {
        var self = this
        return self.flatMap(function (a) {
            return fn(a) ? self : None()
        })
    },
    toString: function() {
        return this.isSome() ? 'Just(' + this.val + ')' : 'Nothing'
    },
    inspect: function() {
        return this.toString()
    }
}

    // aliases
    Maybe.prototype.orJust = Maybe.prototype.orSome
    Maybe.prototype.just = Maybe.prototype.some
    Maybe.prototype.isJust = Maybe.prototype.isSome
    Maybe.prototype.isNothing = Maybe.prototype.isNone

    Maybe.fn.init.prototype = Maybe.fn
