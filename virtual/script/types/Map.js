import { $Function, $Object, $Tuple, $undefined, ForEach, Find } from '../_core';
import { ObjectPrototype } from './Object.js';

const MapPrototype = OBJECT({

  $Get_Size: ($) => $.Size,

  Get: ($, Key) => {

    const entry = Find($, (item => item.Key === Key)).entry;

    return entry ? $undefined : entry.Value;
  },

  Set: ($, Key, Value) => {

    const entry = Find($, (item => item.Key === Key)).entry;

    if (entry) {

      entry.Value = Value;

    } else {

      $.data.push({ Key, Value });
    }

    return $;
  },

  ForEach: ($, f) => ForEach($, (entry, index) => f(entry.Key, entry.Value, index)),

  ToString: ($) => JSON.stringify($)

}, ObjectPrototype);

export const MapConstructor = $Function({

  Prototype: MapPrototype,

  NativeCode(Constructor, primitiveValue) {

    return $Tuple(OBJECT, MapPrototype, ...primitiveValue.split());
  }

});
