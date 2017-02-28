
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
      assert($.value == null, 'Illegal state exception');
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

var Validation = root.Validation = {};

var Success = {
  success: ($) => $.valueOf(),
  fail: ($) => 'Illegal state. Cannot call fail() on a Validation.Success',
  isSuccess: ($) => true,
  isFail: ($) => false,

  chain: ($, fn) => fn($.valueOf()),
  ap: ($, validationWithFn) => validationWithFn.map(fn => fn($.valueOf()))
  ,
  acc($) {
      var x = () => x;
      return Validation.success(x);
  },
  cata: ($, fail, success) => success($.valueOf()),
  failMap: ($, fn) => $,
  bimap: ($, fail, success) => $.map(success),
  equals: ($, other) => other.cata(equals(fail), falseFunction),
  toMaybe: ($) => Some.of($.valueOf()),
  toEither: ($) => Right.of($.valueOf())

};

var Fail = {
  success: ($) => fnThrow('Illegal state. Cannot call success() on a Validation.Fail'),
  fail: ($) => $.valueOf(),
  isSuccess: ($) => false,
  isFail: ($) => true,

  chain: ($, fn) => $,
  ap: ($, validationWithFn) => (validationWithFn.isFail() ?
          Validation.Fail(Semigroup.append($.val, validationWithFn.fail()))
          : $)
  ,
  acc: ($) => $,
  cata: ($, fail, success) => fail($.valueOf()),
  failMap: ($, fn) => Fail(fn($.valueOf())),
  bimap: ($, fail, success) => $.failMap(fail),
  equals: ($, other) => other.cata(falseFunction, equals(success)),
  toMaybe: ($) => None(),
  toEither: ($) => Left($.valueOf())
};

Validation = {
  of: v=>Success(v),
  init:($) => ({
      isSuccessValue: !$.isLeft
  })
};
