import {
  $Object,
  $Function,
  ObjectPrototype,
  ValueOf,
  $true,
  $false
} from '../_core.js';

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
