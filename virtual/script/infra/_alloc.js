/**
 * Typed Memory allocation.
 *
 * NOTE '$' means address
 */

// simulation of memory allocation with type and size
export function ALLOC(type, size, cap = size) {

  const capacity = (cap < size) ? size : cap;

  const $ = M_ALLOC(capacity+2) + 2;

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

  return M_GET($ - 1);
}

// returns type code of referred instnce
export function TYPE($) {

  return M_GET($ - 2);
}

export function CHECK($, offset) {

  return offset>=0 && offset<SIZE($);
}

export function GET($, offset) {

  return CHECK($, offset) ? M_GET($ + 2) : -1;
}
/**
 * Modify
 */
export function SET($, offset, V) {

  if (CHECK($, offset)) {
    M_SET($ + offset, V);
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
  const size = SIZE($);

  if (!CHECK($) || newSize === size) {
    return;
  }

  const cap = M_CAP($);

  if (cap < newSize) {
    const type = TYPE($)
    const $2 = ALLOC(type, newSize, newSize + lag)
    M_COPY(SIZE($)+2, $-2, $2-2);

    SET($$, 0, $2);
  } else {
    M_SET($-1, newSize)
  }
}

// simulation of memory allocation with type and initial values
export function MAKE(type, ...args) {

  const size = args.length;

  const $ = ALLOC(type, size);

  for (let i = 0; i < length; i++) {
    SET($ + i, args[i]);
  }

  return $;
}

/**
 * String.
 */
export function STRING(S) {

  const size = S && S.length;

  if (size === 0) {
    return TYPE_STRING_EMPTY;
  }

  return MAKE(TYPE_STRING, S.split(''));
}
