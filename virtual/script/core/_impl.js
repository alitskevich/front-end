// ----------------------------------------------
// Instantiate
// ----------------------------------------------

/**
 * Memory allocation.
 *
 * '$' means address
 */

const MEMORY = [];
const ADDR_INC = 0;

export function ALLOC(type, size, cap = size) {

  const capacity = (cap < size) ? size : cap;
  const bytes = ArrayBuffer(4 * capacity + 1);
  const view = new DataView(bytes, 0, size);

  view.setInt8(0, type);

  const $ = ADDR_INC++;
  MEMORY[$] = view;

  return $;
}

export function MAKE(type, ...args) {

  const size = args.length;

  const $ = ALLOC(type, size);

  const view = MEMORY[$];

  for (let i = 0; i < length; i++) {
    view.setUint32(4 * i + 1, args[i]);
  }

  return $;
}

export function RESIZE($, newSize, lag = 0) {
  if ($ < 0) {
    return;
  }
  if (newSize === SIZE($)) {
    return;
  }

  let view = MEMORY[$];
  let buff = view.buffer;

  let cap = buff.byteLen;
  let newCap = 4 * newSize + 1;
  let destView;

  if (cap < newCap) {
    buff = ArrayBuffer(newCap + lag);
    destView = new DataView(buff, 0, newCap);

    destView.setInt8(0, view.getUint8(0));
    for (let i = 0; i < newSize; i++) {
      let pos = 4 * i + 1;
      destView.setUint32(pos, view.getUint32(pos));
    }
  } else {
    destView = new DataView(buff, 0, newCap);
  }

  MEMORY[$] = destView;
}

export function DESTROY($) {
  if ($ < 0) {
    return;
  }
  delete MEMORY[$];
}

// ----------------------------------------------
// General
// ----------------------------------------------

/**
 * types
 */

export const TYPE_UNDEFINED = -1;
export const TYPE_NULL = -2;
export const TYPE_NOT_A_NUMBER = -4;

export const TYPE_BOOL_FALSE = -8;
export const TYPE_INT_ZERO = -16;
export const TYPE_FLOAT_ZERO = -32;
export const TYPE_STRING_EMPTY = -64;

export const TYPE_BOOL_TRUE = 8;
export const TYPE_INFINITE_NUMBER = 4;
export const TYPE_STRING = 5;
export const TYPE_NUMBER = 6;
export const TYPE_INT = 6;
export const TYPE_NUMBER_NEGATIVE = 6;
export const TYPE_PAIR = 7;
export const TYPE_SYMBOL =	8;
export const TYPE_TUPLE = 12;
export const TYPE_MAP = 13;

export function TYPE($) {

  return MEMORY[$].getInt8(0);
}

// false, null, undefined, NaN, 0 and "" are falsy; everything else is truthy.
export function TRUTHY(V) {

  return TYPE(V) > 0;
}

/**
 * Global instances
 */

export const UNDEFINED = (TYPE_UNDEFINED);
export const NULL = (TYPE_NULL);
export const NAN = (TYPE_NOT_A_NUMBER);
export const ZERO = (TYPE_INT_ZERO);
export const STRING_EMPTY = (TYPE_STRING_EMPTY);

export const TUPLE_EMPTY = MAKE(TYPE_TUPLE);

/**
 * Inspect
 */

export function SIZE($) {
  if ($ < 0) {
    return 0;
  }
  return (MEMORY[$].byteLength - 1) / 4;
}

export function GET($, offset) {
  if ($ < 0) {
    return UNDEFINED;
  }
  return MEMORY[$].getUint32(4 * offset + 1);
}

export function EQUALS($a, $b) {

  if ($a === $b && $a !== NAN) {
    return 1;
  }

  const Ta = TYPE($a);
  if (Ta !== TYPE($b)) {
    return 0;
  }

  if ($a < 0 || $b < 0) {
    return false;
  }

  const Sa = SIZE($a);
  if (Sa !== SIZE($b)) {
    return 0;
  }

  const Ba = MEMORY[$a].buffer;
  const Bb = MEMORY[$b].buffer;
  if (Ba === Bb && Ba.offset === Bb.offset) {
    return 1;
  }

  for (let i = 0; i < Sa; i++) {
    if (GET($a, i) !== GET($b, i)) {
      return 0;
    }
  }

  return 1;
}

export function INDEX_OF($, V) {
  if ($ < 0) {
    return -1;
  }

  for (let i = 0, length = SIZE($); i < length; i++) {

     const item = GET($, i);
     if (EQUALS(V, item)) {
       return i;
     }
   }

   return -1;
}

export function HASH($) {

  let hash = 0;
  const size = SIZE($);
  if (size === 0) {
    return hash;
  }
  const V = MEMORY[$];
  for (let i = 0; i < 4 * size; i += 4 ) {
    let chr = V.getUint32(i);
    hash = ((hash << 5) - hash) + chr;
    // Convert to 32bit integer
    hash |= 0;
  }
  return hash;
}

/**
 * Modify
 */
export function SET($, offset, val) {

  if ($ < 0) {
    return;
  }

  MEMORY[$].setUint32(4 * offset + 1, val);
}

export function SET64($, offset, val) {

  if ($ < 0) {
    return;
  }

  MEMORY[$].setUint64(4 * offset + 1, val);
}

export function COPY(size, $s, sOffset, $t, tOffset) {

  if ($s < 0 || $t < 0) {
    return;
  }
  const s = MEMORY[$s];
  const t = MEMORY[$t];

  const si = 4 * sOffset + 1;
  const ti = 4 * tOffset + 1;

  for (let i = 0; i < 4 * size; i += 4 ) {
    t.setUint32(ti + i, s.getUint32(si + i));
  }
}

// ----------------------------------------------
// Types
// ----------------------------------------------

/**
 * Int.
 */
export function INT(V) {

  if (V === 0) {
    return TYPE_INT_ZERO;
  }

  const $ = ALLOC(TYPE_INT, 2);

  SET64($, 0, V);

  return $;
}

/**
 * Int.
 */
export function STRING(V) {
  const size = V && V.length;

  if (size === 0) {
    return TYPE_STRING_EMPTY;
  }

  return MAKE(TYPE_STRING, V.split(''));
}

/**
 * Tuple.
 */
export function NEW_TUPLE(length, cap) {

  if (length === 0) {
    return TUPLE_EMPTY;
  }

  const $ = ALLOC(TYPE_TUPLE, length, cap);

  return $;
}

export function TUPLE(...args) {

  const length = args.length;

  if (length === 0) {
    return TUPLE_EMPTY;
  }

  return MAKE(TYPE_TUPLE, ...args);
}

/**
 * Map
 */
export function NEW_MAP() {

  return MAKE(TYPE_MAP, UNDEFINED, UNDEFINED);
}

export function MAP(...args) {

  const size = args.length / 2;

  const $keys = NEW_TUPLE(size);
  const $values = NEW_TUPLE(size);

  const $ = MAKE(TYPE_MAP, $values, $keys);

  for (let i = 0; i < size; i += 2) {
    SET($values, i, args[i + 1]);
    SET($keys, i, args[i]);
  }

  return $;
}

export const MAP_VALUES = ($) => GET($, 0);
export const MAP_KEYS = ($) => GET($, 1);
export const MAP_SIZE = ($) => GET($, 2);
export const MAP_INDEX_OF_KEY = ($, $key) => INDEX_OF(MAP_KEYS($), $key);
export const MAP_HAS_KEY = ($, $key) => MAP_INDEX_OF_KEY($, $key) !== -1;

export const MAP_GET = ($, $key) => {

  const index = MAP_INDEX_OF_KEY($, $key);

  if (index === -1) {
    return UNDEFINED;
  }

  return GET(MAP_VALUES($), index);
};

export function MAP_SET($, $key, V) {

  let index = MAP_INDEX_OF_KEY($, $key);
  let $values = MAP_VALUES($);

  if (index === -1) {

    const size = MAP_SIZE($);
    index = size;

    RESIZE(MAP_KEYS($), size + 1, 5);
    RESIZE($values, size + 1, 5);
  }

  SET($values, index, V);
}
