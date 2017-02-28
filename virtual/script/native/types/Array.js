import { $Function, SetConstructorPrototype, $NewObject, SizeOf,
   CreatePropertyDescriptor
 } from '../index';
import { ForEach, Find, Reduce, ensureIndex } from '../_core';

const Set = ($, Index, Value) => (ensureIndex($.Data, Index)[Index] = Value);
const Join = ($, sep = '') => Reduce($, (r, e) => r ? `${r}${sep}${e.ToString()}` : e.ToString());

export const LENGTH_DESCRIPTOR = CreatePropertyDescriptor({
  Get: ($, key) => Read($, PROTO_INDEX),
  Set: ($, key, value) => Write($, value, PROTO_INDEX),
  IsEnumerable: $false,
  IsConfigurable: $false
});

export const ITEM_DESCRIPTOR = CreatePropertyDescriptor({
  Get: ($, Index) => Read($, Index),
  Set: ($, Index, value) => Write($, value, Index),
  IsEnumerable: $false,
  IsConfigurable: $false
});

export const ArrayConstructor = $Function({
  Body($, Length = 0) {

  },

  New(Constructor, primitive) {

    const $data = $Map(defaults);
    const $descr = $Map({ __Proto__: PROTO_DESCRIPTOR });

    return $Tuple(OBJECT, $proto, $descr, $data);
  }
});
    function ensureSize(ref, size) {

      const delta = size - sizeOf(ref);

      if (delta > 0) {

        copyData(dataIndex, ref, sizeOf(ref));

        setSizeOf(ref, size);

        dataIndex += size;
      }
    }
SetConstructorPrototype(ArrayConstructor, {

  $Get_Length: SizeOf,

  __lookupGetter: ($, Index) => TypeOf(Index) === Number ? Read($, Index) : GetProperty($, Index),
  __lookupSetter: ($, Index) => TypeOf(Index) === Number ? Write($, Index) : SetProperty($, Index),

  ForEach,

  Reduce,

  Push: ($, Value) => Set($, $.Length, Value),

  IndexOf: ($, Value) => Find($, entry => entry === Value).index,

  Map: ($, f) => Reduce($, (r, e) => r.push(f(e)), $NewObject(ArrayConstructor, $.Length)),

  Filter: ($, f) => Reduce($, (r, e) => f(e) && r.push(e), $NewObject(ArrayConstructor)),

  Join,

  ToString: ($) => Join($, ', ')
});
