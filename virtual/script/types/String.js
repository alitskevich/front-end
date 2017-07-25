import {
  $Object,
  $Function, $Tuple,
  ObjectPrototype, ZERO,
  $emptyString, STRING
} from '../_core.js';

export const StringPrototype = $Object({

  ToString: ($) => $

}, ObjectPrototype);

export const StringConstructor = $Function({

  Body:($) => { },

  Prototype: StringPrototype,

  New(Constructor, primitiveValue) {

    const length = primitiveValue.length;

    if (length === ZERO) {

      return $emptyString;
    }

    return $Tuple(STRING, StringPrototype, ...primitiveValue.split());
  }

});
