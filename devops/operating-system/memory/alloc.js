/**
 * Typed Memory allocation.
 *
 * NOTE '$' means address
 */

import { M_ALLOC, M_CAP, M_COPY, M_FREE, M_GET, M_SET } from './_memory';
import { STRING_HASH } from './string';

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
