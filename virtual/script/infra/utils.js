/**
 * Inspection
 */

// false, null, undefined, NaN, 0 and "" are falsy; everything else is truthy.
export function TRUTHY($) {

  return $ === 1 || TYPE($) > 0;
}


export function EQUALS($a, $b) {

  if ($a === $b && $a !== NAN) {
    return 1;
  }

  return M_EQUALS($a, $b);
}

export function INDEX_OF($, V) {

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
  for (let i = 0; i < 4 * size; i += 4 ) {
    let chr = GET($, i);
    hash = ((hash << 5) - hash) + chr;
    // Convert to 32bit integer
    hash |= 0;
  }
  return hash;
}
