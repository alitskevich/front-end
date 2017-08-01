import { FUNCTION, OBJECT } from '../_core.js';

export const STRING_PROTOTYPE = OBJECT(ROOT, {

  ToString: ($) => $

});

export const StringConstructor = FUNCTION({

  Prototype: STRING_PROTOTYPE,

  NativeCode(Constructor, chars) {

    $.Primitive =  STRING(chars);
  }
});
