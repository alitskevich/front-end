
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
