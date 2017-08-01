import { FUNCTION, OBJECT } from '../_core.js';

export const STRING_PROTOTYPE = OBJECT(ROOT, {

  ToString: ($) => $

});

export const StringConstructor = struct.Object({

  Proto: FUNCTION_PROTOTYPE,

  Primitive: struct.Function({

    NewPrototype: STRING_PROTOTYPE,

    Code(Constructor, chars) {

      $.Primitive = STRING(chars);
    }
  })
});
