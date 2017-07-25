import { ZERO, TYPE_CODES, $Tuple, $Object, $Function, ObjectPrototype, ValueOf, $NaN, $zero } from './_core.js';

export const { NUMBER, NUMBER_ZERO, NOT_A_NUMBER } = TYPE_CODES;

const FIXED_INDEX = 0x0;
const EXP_INDEX = 0x1;
const SIGN_INDEX = 0x2;

export function FixedValueOf($) {

  return ValueOf($, FIXED_INDEX);
}

export function ExponentValueOf($) {

  return ValueOf($, EXP_INDEX);
}

export const NumberPrototype = $Object({

  ValueOf($) {

    return ValueOf($, SIGN_INDEX) * FixedValueOf($) * ExponentValueOf($);
  },

  ToString: ($) => '' + ValueOf($)

}, ObjectPrototype);

export const NumberConstructor = $Function({

  Body:($) => { },

  Prototype: NumberPrototype,

  New(Constructor, fixed, exp = 0, sign = 1) {

    if (sign === ZERO) {

      return $NaN;
    }

    if (fixed === ZERO) {

      return $zero;
    }

    return $Tuple(NUMBER, fixed, exp, sign);
  }
});
