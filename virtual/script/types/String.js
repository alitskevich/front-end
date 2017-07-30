import {
  $Object,
  $Function, $Tuple,
  ObjectPrototype, ZERO,
  $emptyString, STRING
} from '../_core.js';

export function STRING_NEW(length) {
  const $ = ALLOC(TYPE_STRING, 2);
  SET($, 0, 0);
  SET($, 1, length);
  return $;
}

export function STRING_MAKE(...chars) {

  const length = chars.length;

  const $ = STRING_NEW(length);
  const $values = ALLOC(0, length);
  SET($, 0, $values);
  for (let i = 0; i < length; i++) {

    SET($values, i, chars[i]);
  }

  return $;
}
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
