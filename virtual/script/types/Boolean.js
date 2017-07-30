import {
  $Object,
  $Function,
  ObjectPrototype,
  ValueOf,
  $true,
  $false
} from '../_core.js';

export const FALSE = SCALAR(TYPE_BOOL, 0);
export const TRUE = SCALAR(TYPE_BOOL, 1);

export function BOOL_OF(V) {
  return TRULY(V) ? TRUE : FALSE;
}
export const BooleanPrototype = $Object({

  ValueOf,

  ToString: ($) => ValueOf($) ? 'true' : 'false'

}, ObjectPrototype);

export const BooleanConstructor = $Function({

  Body:($) => { },

  Prototype: BooleanPrototype,

  New(Constructor, primitive) {

    return primitive ? $true : $false;
  }
});
