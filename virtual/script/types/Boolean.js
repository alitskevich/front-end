import {FALSE, TRUE, OBJECT, OBJECT_PRIMITIVE, ROOT, FUNCTION } from '../_core.js';

export const FALSE = MAKE(TYPE_BOOL_FALSE);// 0
export const TRUE = MAKE(TYPE_BOOL_TRUE);// 1

const BOOLEAN_PROTOTYPE = OBJECT(ROOT, {

  ValueOf: OBJECT_PRIMITIVE,

  ToString: ($) => OBJECT_PRIMITIVE($) === TRUE ? 'true' : 'false'

});

export const BooleanConstructor = struct.Object({

  Proto: FUNCTION_PROTOTYPE,

  Primitive: struct.Function({

    Name: 'Boolean',

    NewPrototype: BOOLEAN_PROTOTYPE,

    NativeCode($, V) {

      $.Primitive = TRULY(V) ? TRUE : FALSE;
    }
  })
});
