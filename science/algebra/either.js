/* Either Monad */
export const Left = {
    ...Monad,
    chain: fnId,
    ap: fnId,
    leftMap: ($, fn) => Left(fn($.valueOf())),
    cata: ($, l, r) => l($.valueOf()),
    bimap: ($, leftFn, rightFn) => $.leftMap(leftFn),
  
    right:($) => nThrow('Illegal state. Cannot call right() on a Either.left'),
    left:($) => $.valueOf(),
  
    equals: ($, other) => isFunction(other.cata) && other.cata(equals($.valueOf()), falseFunction),
  
    toMaybe: ($) => None.of($.valueOf()),
    toValidation: ($) => Fail($.valueOf())
  };
  
  export const Right = {
  
    ...Monad,
  
    // ap: ($, eitherWithFn) => eitherWithFn.map((fn) => fn($.valueOf())),
    // chain: Chain.chain,
  
    leftMap: ($, fn) => $,
    cata: ($, l, r) => r($.valueOf()),
    bimap: ($, l, r) => $.map(r),
  
    right:($) => $.valueOf(),
    left:($) => assert(false, 'Illegal state. Cannot call left() on a Either.right'),
  
    equals: ($, other) => isFunction(other.cata) && other.cata(falseFunction, equals($.valueOf())),
  
    toMaybe: ($) => Just($.valueOf()),
    toValidation: ($) => Success($.valueOf())
  };
  export const Either = {
    init: ($) => ({
      isRight: !$.isLeft
    })
  };