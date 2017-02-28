import { $Function, $Tuple, $Map, FUNCTION_PROTOTYPE } from '../_core';

export const FunctionConstructor = $Function({

  Body:($) =>{ },

  Prototype: FUNCTION_PROTOTYPE,

  New(Constructor, defaults, ...Params) {

    const $data = $Map(defaults);
    const $descr = $Map({ __Proto__: PROTO_DESCRIPTOR });

    return $Tuple(OBJECT, $proto, $descr, $data);
  }
});
