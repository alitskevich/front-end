/**
 * Memory allocation.
 *
 * NOTE '$' means address
 */

const BYTES = ArrayBuffer(1024*64);
const MEMORY = new DataView(BYTES);

// simulation of memory allocation with type and size
export function ALLOC(type, size, cap = size) {

  const capacity = (cap < size) ? size : cap;
  const byteLength = (4 * (capacity + 1));

  const $ = MEMORY.getInt16(0, type) || 1;

  MEMORY.setUint8($ + 0, capacity);
  MEMORY.setUint8($ + 1, size);
  MEMORY.setInt16($ + 2, type);

  MEMORY.setInt16(0, $ + byteLength)

  return $;
}

// destroys instance allocation and free memory
export function DESTROY($) {

  if ($ > 0) {
    MEMORY.setInt16($ + 2, 0);
  }
}

// returns size of allocated instance
export function SIZE($) {

  return ($ < 0) ? 0 : MEMORY.getUint8($+1);
}

// returns type code of referred instnce
export function TYPE($) {

  return ($ < 0) ? $ : MEMORY.getInt16($+2);
}

export function GET($, offset) {

  return ($ < 0) ? UNDEFINED : MEMORY.getUint32($ + 4 * (offset + 1));
}
/**
 * Modify
 */
export function SET($, offset, val) {

  if ($ > 0) {
    MEMORY.setInt32($ + 4 * (offset + 1), val);
  }
}

export function SET16($, offset, num, val) {

  if ($ > 0) {
    MEMORY.setInt16($ + 4 * (offset + 1) + num, val);
  }
}

export function SET64($, offset, val) {

  if ($ > 0) {
    MEMORY.setInt64($ + 4 * (offset + 1), val);
  }
}

export function COPY(size, $s, sOffset, $t, tOffset) {

  if ($s < 0 || $t < 0) {
    return;
  }

  const si = 4 * (sOffset + 1);
  const ti = 4 * (tOffset + 1);

  for (let i = 0; i < 4 * size; i += 4 ) {
    t.setUint32($t + ti + i, s.getUint32($s + si + i));
  }
}

// resize or re-allocate existing instance
export function RESIZE($$, newSize, lag = 0) {

  const $ = GET($$, 0)
  if ($ < 0) {
    return;
  }

  if (newSize === SIZE($)) {
    return;
  }

  let cap = MEMORY.getUint8($);

  if (cap < newSize) {
    const type = TYPE($)
    const $2 = ALLOC(type, newSize, newSize + lag)
    SET($$, 0, $2);
    COPY(size, $, 0, $2, 0)
  } else {
    MEMORY.setUint8($+1, newSize)
  }
}

// simulation of memory allocation with type and initial values
export function MAKE(type, ...args) {

  const size = args.length;

  const $ = ALLOC(type, size);

  for (let i = 0; i < length; i++) {
    MEMORY.setUint32($+ 4 * (i + 1), args[i]);
  }

  return $;
}
