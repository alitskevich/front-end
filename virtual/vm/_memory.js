/**
 * Memory allocation.
 *
 * NOTE '$' means word-based address
 */

const WORD = 4;
const SIZE = Math.pow(2, 20);
const BYTES = new ArrayBuffer(SIZE);
const MEMORY = new DataView(BYTES);
// get available address and shift it to next length
const NEXT = (capacity) => {
  const $ = MEMORY.getUint32(0);
  MEMORY.setInt32(0, $ + capacity + 1)
  return $;
}
// reserve for the first-available pointer
MEMORY.setInt32(0, 1);

// simulation of memory allocation with type and size
export function M_ALLOC(capacity) {

  const $ = NEXT(capacity) + 1;

  MEMORY.setInt32(WORD * ($ - 1), capacity);
  for (let i = 0; i < capacity; i++) {
    MEMORY.setUint32(WORD * ($ + i), 0);
  }
  return $;
}

// checks if address is in bounds
const CHECK = ($) => ($ > 0 && $ < SIZE);

// frees memory
export function M_FREE($) {

  if (CHECK($)) {
    MEMORY.setInt32(WORD * ($ - 1), -M_CAP($));
  }
}

export function M_CAP($) {

  if (CHECK($)) {
    return MEMORY.getInt32(WORD * ($ - 1));
  }
}

export function M_GET($) {

  return !CHECK($) ? -1 : MEMORY.getInt32(WORD * $);
}

export function M_SET($, V) {

  if (CHECK($)) {
    MEMORY.setInt32(WORD * $, V);
  }
}

export function M_SET_HALF_LO($, V) {

  if (CHECK($)) {
    MEMORY.setInt16(WORD * $, V);
  }
}

export function M_SET_HALF_HI($, V) {

  if (CHECK($)) {
    MEMORY.setInt16(WORD * $ + 2, V);
  }
}

export function M_SET_DOUBLE($, V) {

  if (CHECK($)) {
    MEMORY.setInt64(WORD * $, V);
  }
}

export function M_COPY(size, $s, $t) {

  if (!CHECK($s) || !CHECK($t)) {
    return;
  }
  const s = WORD * $s;
  const t = WORD * $t;
  for (let i = 0; i < WORD * size; i += WORD) {
    MEMORY.setInt32(t + i, MEMORY.getInt32(s + i));
  }
}

export function M_EQUALS(size, $a, $b) {

  if (!CHECK($a) || !CHECK($b)) {
    return -1;
  }

  if (M_CAP($a) < size || M_CAP($b) < size) {
    return -1;
  }

  if ($a === $b) {
    return 1;
  }

  const a = WORD * $a;
  const b = WORD * $b;

  for (let i = 0; i < size; i += WORD) {
    if (MEMORY.getInt32(a + i) !== MEMORY.getInt32(b + i)) {
      return 0;
    }
  }

  return 1;
}
