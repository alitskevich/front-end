export const None = {

    ...Monad,
  
    chain: fnId,
    ap: fnId,
  
    valueOf: $ => fnThrow('Illegal state'),
    orSome: ($, otherValue) => otherValue,
    orElse: ($, maybe) => maybe,
    equals: ($, other) => other === $,
    fold: ($, defaultValue) => f => defaultValue,
    cata: ($, none, some) => none(),
    filter: ($, fn) => $.flatMap(a => $),
  
    toString: ($) => 'None',
    toList: ($) => $.map(List).orSome(Nil),
    toEither: Left.of,
    toValidation: Fail.of
  
  };
  
  /*  Monad */
  export const Just = {
    init: ($) => {
        assert($.value == null, 'Illegal state');
    },
    some: $ => $.valueOf(),
    orSome: ($, otherValue) => $.valueOf(),
    orElse: ($, maybe) => $,
    equals: (other) => isFunction(other.isNone) && isFunction(other.map) &&
          this.ap(other.map(equals)).orElse(false)
    ,
    fold: ($, defaultValue) => fn => fn($.valueOf()),
    cata: ($, none, some) => some($.valueOf()),
    filter: ($, fn) => $.chain(a => fn(a) ? $ : Nothing),
  
    toList: $ => $.map(List).orSome(Nil),
    toEither: ($, failVal) => Right($.valueOf()),
    toValidation: ($, failVal) => Success($.valueOf())
  
  };
  
  // Maybe
  export const Maybe = {
    _setup:($) => ({
      of: Just.of,
      fromNull: a => a == null ? Nothing : Just.of(a),
      toList: maybe => maybe.toList()
    })
  };
  