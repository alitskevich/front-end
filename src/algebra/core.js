import { append } from 'utils/obj.js';

export const Identity = {

  equals: ($, X) => ($.valueOf() === X.valueOf())
};

export const Semigroup = {

  append:($, x ) => $.of( append($.valueOf(), x) )
};

export const Foldable = {

  fold:($, defaultValue ) => fn => fn($.valueOf(), defaultValue)
};

export const Chain = {

  // aliases: flatMap
  chain:($, xX ) => xX( $.valueOf() )
};

export const Functor = {

  // unpack, applies the function and packs into another Monad!
  map: ($, xx ) => new $.constructor( xx( $.valueOf() ) )
};

export const Bifunctor = {

  // Applies the function but returns another Monad!
  bimap: ($, xx, yy ) => $.of( ($.isLeft ? xx : yy)( $.valueOf() ) )
};

/**
* Example:
* fn = (a,b)=>a+b
* m1 = Apply.of(2);
* m2 = Apply.of(3);
* // can't fn(m1)(m2) so:
*
* op = Functor.of(curry(fn));
* op1 = m1.ap(op) // op1.valueOf() --> (b) => 2+b
* m3 = m2.ap(op1) // op2.valueOf() --> 5
*/
export const Apply = {

  ...Functor,

  // operator usually contains some curried function on this value
  // and will be mapped using this value into another operator
  ap:($, operator) => operator.map(fn => fn($.valueOf()))
};

export const Applicative = {

  ...Apply,

  of: ($, value) => new $.constructor({ value })
};
