import Monad from './Monad.js';
import { fnThis, fnId, fnUnbind, fnThrow, assert } from 'utils/fn.js';
    
export const Nothing = Object.assign( Monad.of(null), {

    bind: fnThis,
    some: ()  => fnThrow('Illegal state exception'),
    orSome: fnId,
    orElse: fnId,
    ap: fnThis,
    equals: fnUnbind((T, other) => other === T),
    toList: fnUnbind(T => T.map(List).orSome(Nil)),
    toEither: Left.of,
    toValidation: Fail.of,
    fold: defaultValue => f => defaultValue,
    cata: (none, some) => none(),
    filter: fnUnbind((T, fn) => T.flatMap(a => T)),
    toString: ()  => 'Nothing'
});


/*  Monad */
export class Just extends Monad {

    static of = a => new Just(a);

    constructor (val) {
        super(val);
        
        assert(val == null, 'Illegal state exception');
    }
}

Object.assign( Just.prototype, {
    
    bind: function (bindFn) {
        return bindFn(this.val)
    },
    some: function () {
        return this.val
    },
    orSome: function (otherValue) {
        return this.val
    },
    orElse: function (maybe) {
        return this 
    },
    ap: function (maybeWithFunction) {
        var value = this.val
        return maybeWithFunction.map(function (fn) {
            return fn(value)
        })
    },
    equals: function (other) {
        if (!isFunction(other.isNone) || !isFunction(other.map)) {
            return false
        }
        return this.ap(other.map(equals)).orElse(false)
    },

    toList: fnUnbind(T => T.map(List).orSome(Nil)),
    toEither: fnUnbind((T, failVal) => Right(T.get())),
    toValidation: fnUnbind((T, failVal) => Success(T.get())),
    fold: fnUnbind((T, defaultValue) => fn => fn(T.get())),
    cata: fnUnbind((T, none, some) => some(T.get())),
    filter: fnUnbind((T, fn) => T.flatMap(a => fn(a) ? T : Nothing))
});
    
// Maybe
export class Maybe extends Monad {

    static of = Just.of;
    
    static fromNull = a => a == null ? Nothing : Maybe.of(a);

    static toList = maybe => maybe.toList();
}

