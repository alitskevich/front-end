import { device } from '../core/Device.js';

export function fnThrow(error, ErrorType = Error) { throw new ErrorType(error); }

export const assert = (b, error, errorType) => b || fnThrow(error, errorType);

const { alloc, read, write, sizeOf, equals } = device.os.memory;

export const ZERO = 0x0;
export const ONE = 0x1;
export const TWO = 0x2;
export const TYPE_INDEX = 0x0;
export const NOT_FOUND = -0x1;

export function Alloc(type, size = ONE) {

  const $ = alloc(1 + size);

  write($, TYPE_INDEX, type);

  return $;
}

export function Read($, index = ZERO) {

  return read($, index + 1);
}

export function Write($, value, index = ZERO) {

  return read($, index + 1, value);
}

export function TypeOf($) {

  return read($, TYPE_INDEX);
}

export function SizeOf($) {

  return sizeOf($) - 1;
}

export function $Tuple(type, ...defaults) {

  const size = defaults.length;

  const $ = Alloc(type, size);

  for (let i = 0; i < size; i++) {

    Write($, i, defaults[i]);
  }

  return $;
}

export const TYPE_CODES = {
  UNDEFINED: -1,
  NULL: 0,
  NUMBER_ZERO: 1,
  BOOLEAN_FALSE: 2,
  NOT_A_NUMBER: 4,
  STRING_EMPTY: 0x5,
  BOOLEAN_TRUE: 6,
  NUMBER: 7,
  STRING: 0x8,
  SYMBOL:	8,
  FUNCTION: 10,
  OBJECT: 11,
  TUPLE: 12,
  MAP: 13
};

// false, null, undefined, NaN, 0 and "" are falsy; everything else is truthy.
export const likeTrue = ($) => TypeOf($) > 0x5;

/**
 *
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/typeof
 */
export const TYPE_NAMES = {
  Any: 'any',
  Undefined: 'undefined',
  Null: 'object',
  Boolean: 'boolean',
  Number: 'number',
  String: 'string',
  Symbol:	'symbol',
  Function: 'function',
  Object: 'object',
  Array: 'object',
  Date: 'object',
  Error: 'object'
};

export const typeOf = ctr => TYPE_NAMES[ctr.name.slice(0, -4)];

const { NULL, UNDEFINED, BOOLEAN_FALSE, BOOLEAN_TRUE, ARRAY, OBJECT } = TYPE_CODES;
const { STRING, STRING_EMPTY } = TYPE_CODES;

export const $emptyString = $Tuple(STRING_EMPTY);
export const $false = $Tuple(BOOLEAN_FALSE, ZERO);
export const $true = $Tuple(BOOLEAN_TRUE, ONE);

/**
 * Undefined object type.
 */
// Everything in JavaScript ACTS like an object except null and undefined.
export const UNDEFINED_PROPERTY = $Tuple(-1,
  ($, key) => fnThrow(`Cannot read property '${key}' of undefined`, TypeError),
  ($, key, value) => fnThrow(`Cannot set property '${key}' of undefined`, TypeError),
  $false,
  $false,
  $false
);

export const UndefinedPrototype = {
    __lookupGetter: () => Read(UNDEFINED_PROPERTY),
    __lookupSetter: () => Read(UNDEFINED_PROPERTY, ONE),
    ToString: () => 'undefined'
};

export const $undefined = $Tuple(UNDEFINED, ZERO, ZERO, UndefinedPrototype);

/**
 * Null object type.
 */
// Everything in JavaScript ACTS like an object except null and undefined.
export const NULL_PROPERTY = $Tuple(-1,
  ($, key) => fnThrow(`Cannot read property '${key}' of null`, TypeError),
  ($, key, value) => fnThrow(`Cannot set property '${key}' of null`, TypeError),
  $false,
  $false,
  $false
);

export const NullPrototype = {
  __lookupGetter: () => Read(UNDEFINED_PROPERTY),
  __lookupSetter: () => Read(UNDEFINED_PROPERTY, ONE),
  ToString: () => 'null'
};

export const $null = $Tuple(NULL, ZERO, ZERO, NullPrototype);

/**
 * Array/String structure.
 */

export const $ArrayWithSize = (size = ZERO) => Alloc(ARRAY, size);

export const $Array = (...initials) => $Tuple(ARRAY, initials);

// creates a new string
export function $String(primitiveValue) {

  const length = primitiveValue.length;

  if (length === ZERO) {

    return $emptyString;
  }

  return $Tuple(STRING, ...primitiveValue.split());
}

 export function Equals($a, $b) {

   return equals($a, $b);
 }

 export function ValueOfIndex($, index) {

   const length = SizeOf($);

   return (index < ZERO || index >= length) ? $undefined : Read($, index);
 }

 export function IndexOf($, $value) {

   const length = SizeOf($);

   for (let i = ZERO; i < length; i++) {

     if (Equals($value, Read($, i))) {

       return i;
     }
   }

   return NOT_FOUND;
}

export function ForEach($, fn) {

  const size = SizeOf($);

  for (let index = 0; index < size; index++) {

    const item = Read($, index);

    fn.call($, item, index, $);
  }

  return $;
}

export function Find($, fn) {

  const size = SizeOf($);

  for (let index = 0; index < size; index++) {

    const item = Read($, index);

    if (fn(item)) {

      return item;
    }
  }

  return $undefined;
}

export function Reduce($, fn, initialValue) {

  const size = SizeOf($);

  let result = initialValue;

  for (let index = 0; index < size; index++) {

    const item = Read($, index);

    result = fn.call($, result, item, index, $);

  }

  return result;
}

export function Remap($, fn) {

  const size = SizeOf($);

  let result = $ArrayWithSize(size);

  for (let index = 0; index < size; index++) {

    const input = Read($, index);

    const output = fn.call($, result, input, index, $);

    Write(result, index, output);
  }

  return result;
}

/**
 * Map structure
 */
const KEYS_INDEX = 0x0;
const VALUES_INDEX = 0x1;

export function $Map(defaults = {}) {

  const keys = Object.keys(defaults);

  const $keys = $Array(keys);
  const $values = $Array(keys.map(key => defaults[key]));

  return $Tuple(OBJECT, $keys, $values);
}

export const GetKeys = ($) => Read($, KEYS_INDEX);

export const GetValues = ($) => Read($, VALUES_INDEX);

const IndexOfKey = ($, key) => IndexOf(GetKeys($), key);

export const HasKey = ($, key) => IndexOfKey($, key) !== NOT_FOUND;

export const GetValueByKey = ($, key) => ValueOfIndex(GetValues($), IndexOfKey($, key));

export const Assign = ($, $delta) => ForEach(GetKeys($delta), (key, index) =>

    SetValueByKey($, key, GetValueByKey($delta, key))
  );

export function SetValueByKey($, key, value) {

  const index = IndexOfKey($, key);
  const $values = GetValues($);

  if (index === NOT_FOUND) {

    const length = SizeOf($);
    const $keys = GetKeys($);

    Write($keys, key, length);
    Write($values, value, length);

  } else {

    Write($values, value, index);
  }
}
