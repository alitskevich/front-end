import { $Function, $Tuple, $Map, FUNCTION_PROTOTYPE } from '../_core';

const FUNCTION_PROTOTYPE = NewObject({

  Apply: ExecuteFunction,

  Call: ($, This, ...Arguments) => ExecuteFunction($, This, Arguments),

  Bind: ($, BoundToThis) => NewFunction({ ...$, BoundToThis })
});

export const FunctionConstructor = $Function({

  Body:($) =>{ },

  Prototype: FUNCTION_PROTOTYPE,

  New(Constructor, defaults, ...Params) {
  }
});
