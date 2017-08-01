import {FALSE, TRUE, OBJECT, OBJECT_PRIMITIVE, ROOT, FUNCTION } from '../_core.js';

const BOOLEAN_PROTOTYPE = OBJECT(ROOT, {

  ValueOf: OBJECT_PRIMITIVE,

  ToString: ($) => OBJECT_PRIMITIVE($) === TRUE ? 'true' : 'false'

});

export const BooleanConstructor = FUNCTION({

  Prototype: BOOLEAN_PROTOTYPE,

  NativeCode($, V) {

    $.Primitive = TRULY(V) ? TRUE : FALSE;
  }
});
