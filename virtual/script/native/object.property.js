import {
  assert, $Tuple, Read, Write, $null, $true, $false,
  ValueOfIndex,
  HasKey, GetValueByKey, SetValueByKey
} from './_core.js';

export const KEY_GETTER = 0x0;
export const KEY_SETTER = 0x1;
export const KEY_IS_READ_ONLY = 0x2;
export const KEY_IS_ENUMERABLE = 0x3;
export const KEY_IS_CONFIGURABLE = 0x4;
export const KEY_VALUE = 0x5;

const DATA_INDEX = 0x1;
const DESCR_INDEX = 0x1;
const PROTO_INDEX = 0x0;

const Getter = ($, key) => GetValueByKey(Read($, DATA_INDEX), key);
const Setter = ($, key, value) => SetValueByKey(Read($, DATA_INDEX), key, value);

export function CreatePropertyDescriptor({
  Get = Getter,
  Set = Setter,
  IsReadOnly = $false,
  IsEnumerable = $true,
  IsConfigurable = $true,
  Value
}) {

  // assert((IsReadOnly === $true) && Get, `No getter allowed for read-only property '${key}'`);

  return $Tuple(-1, Get, Set, IsReadOnly, IsEnumerable, IsConfigurable, Value);
}

export const DEFAULT_PROPERTY = CreatePropertyDescriptor({});

export const PROTO_DESCRIPTOR = CreatePropertyDescriptor({
  Get: ($, key) => Read($, PROTO_INDEX),
  Set: ($, key, value) => Write($, value, PROTO_INDEX),
  IsEnumerable: $false,
  IsConfigurable: $false
});

const GetOwnDesriptors = $ => ValueOfIndex($, DESCR_INDEX);

// use Prototype if no own
export function LookupPropertyDescriptor($, key) {

  const $defs = GetOwnDesriptors($);

  if (HasKey($defs, key)) {

    return GetValueByKey($defs, key);
  }

  const $proto = Read($, PROTO_INDEX);
  if ($proto !== $null) {

    return LookupPropertyDescriptor($proto, key);
  }

  return DEFAULT_PROPERTY;
}

export function DefineProperty($, key, Config = {}) {

  const $defs = GetOwnDesriptors($);

  const $prop = LookupPropertyDescriptor($, key);

  assert(GetValueByKey($prop, KEY_IS_CONFIGURABLE), `property '${key}' is already defined`);

  SetValueByKey($defs, key, CreatePropertyDescriptor(Config));
}
