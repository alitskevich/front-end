import {
  assert, TYPE_CODES,
  Read, $Tuple, $Map, $undefined,
  GetValueByKey,
  $null
} from './_core.js';

import { LookupPropertyDescriptor,
  PROTO_DESCRIPTOR,
  KEY_IS_READ_ONLY, KEY_SETTER, KEY_GETTER
} from './object.property.js';

const { OBJECT } = TYPE_CODES;

export function $Object(defaults, $proto) {

  const $data = $Map(defaults);
  const $descr = $Map({ __Proto__: PROTO_DESCRIPTOR });

  return $Tuple(OBJECT, $proto, $descr, $data);
}

export function HasOwnProperty($, key) {

  return GetOwnProperty($, key) !== $undefined;
}

function GetOwnProperty($, key) {

  const $prop = LookupPropertyDescriptor($, key);
  const getter = GetValueByKey($prop, KEY_GETTER);

  return getter($, key);
}

export function GetPrototypeOf($) {

  return Read($);
}

export function GetProperty($, key) {

  const ownValue = GetOwnProperty($, key);
  if (ownValue !== $undefined) {

    return ownValue;
  }

  const $proto = Read($);
  if ($proto !== $null) {

    return GetProperty($proto, key);
  }

  return $undefined;
}

export function SetProperty($, key, value) {

  const $prop = LookupPropertyDescriptor($, key);

  const setter = GetValueByKey($prop, KEY_SETTER);

  assert(GetValueByKey($prop, KEY_IS_READ_ONLY), `property '${key}' is read only`);

  return setter($, key, value);
}
