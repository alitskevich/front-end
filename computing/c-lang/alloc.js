/**
 * Typed Memory allocation.
 *
 * NOTE '$' means address
 */

    // heap
const MALLOC = (size) => { 
  const $ = NEXT_FREE_$
  NEXT_FREE_$+=size+1
  W($, size)
  return $
}
const MSIZEOF = p => BLOCKS[p][1]
const MREAD = (p, offset=0) => R(BLOCKS[p][0]+offset)
const MWRITE = (p, offset=0, val=0) => W(BLOCKS[p][0]+offset, val)
const MFILL = (p, val=0) => {
    const len = MSIZEOF(p)
    for (let i = 0; i < len; i++) {
        W(BLOCKS[p][0]+i, val)
    }
}

/*
 * JS variables are represented as consists of type, len and value.
 */
function ALLOC(typ, sz=1, len=0) {
  const $ = MALLOC(1+sz)
  MWRITE($,0, type & 0xF000 | len & 0x0FFF)
  return $
}
const TYP = ($) => MREAD($) & 0xF000
const LEN = ($) => MREAD($) & 0x0FFF
const SET_LEN = ($, len) => MWRITE($, 0, TYP($) & 0xF000 | len & 0x0FFF)
const VAL = ($, offset=0) => MREAD($, 1+offset)
const SET = ($, val, offset=0) => MWRITE($, 1+offset, val)
function COPY($, $from=0, len=1, offset=0) {
  for (let i = 0; i < len; i++) {
      SET($, $from===0 ? 0 : MREAD($from, i), i+offset)
  }
  return $
}

// simulation of memory allocation with type and size
export function ALLOC(type, size, cap = size) {

  const capacity = (cap < size) ? size : cap;

  const $ = M_ALLOC(capacity + 2) + 2;

  M_SET($ - 1, size);
  M_SET($ - 2, type);

  return $;
}

// destroys instance allocation and free memory
export function DESTROY($) {

  M_FREE($ - 2);
}

// returns size of allocated instance
export function SIZE($) {

  return $>1 ? M_GET($ - 1) : 0;
}

// returns type code of referred instance
export function TYPE($) {

  return $>2 ? M_GET($ - 2) : $;
}

export function CHECK($, offset) {

  return offset >= 0 && offset < SIZE($);
}

export function GET($, offset=0) {

  return CHECK($, offset) ? M_GET($ + offset) : -1;
}

/**
 * Modify
 */
export function SET($, offset=0, V) {

  if (CHECK($, offset)) {
    M_SET($ + offset, V);
  }
}

// resize or re-allocate existing instance
export function RESIZE($$, offset, newSize, lag = 0) {

  const $ = GET($$, offset);
  const size = SIZE($);

  if (size>0 && !CHECK($, 0) || newSize === size) {
    return;
  }

  const cap = CHECK($) ? M_CAP($-2)-2 : 0;

  if (cap < newSize) {

    const $2 = ALLOC(TYPE($), newSize, newSize + lag);

    M_COPY(size, $, $2);

    SET($$, offset, $2);
  } else {
    M_SET($ - 1, newSize)
  }
}

// simulation of memory allocation with type and initial values
export function MAKE(type, ...args) {

  const size = args.length;

  const $ = ALLOC(type, size);

  for (let i = 0; i < size; i++) {
    SET($, i, args[ i ]);
  }

  return $;
}
