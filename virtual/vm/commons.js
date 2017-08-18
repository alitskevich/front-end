/**
 * Inspection
 */

import { GET, SIZE, TYPE } from './alloc';
import { STRING_HASH } from './string';
import { FALSE, TRUE, TYPE_MAP } from './_const';
import { M_EQUALS } from './_memory';
import { MAP_KEYS, MAP_VALUES } from './map';

// false, null, undefined, NaN, 0 and "" are falsy; everything else is truthy.
export function TRUTHY($) {

  return $ === 1 || TYPE($) > 0 ? TRUE: FALSE;
}

export const TYPEOF = $ => TYPE_NAMES[ $.Ctor.Name ];

export function EQUALS($a, $b) {

  if ($a === $b && $a !== NAN) {
    return TRUE;
  }

  return M_EQUALS($a, $b);
}

export function FOR_EACH($, fn) {

  const size = SIZE($);
  for (let i = 0; i < size; i++) {
    let e = GET($, i);
    fn(e, i, $);
  }
}

export function HASH(V, seed = 0) {

  if (typeof V ==='string') {
    return STRING_HASH(V);
  } else {
    const $=V;
    const size = SIZE($);
    let type = TYPE($);
    let hash = seed;
    hash = (((hash << 5) - hash) + type) | 0;
    if (type === TYPE_MAP) {
      return HASH(MAP_KEYS($), HASH(MAP_VALUES($)))
    }
    for (let i = 0; i < size; i ++) {
      let chr = GET($, i);
      hash = ((hash << 5) - hash) + chr;
      // Convert to 32bit integer
      hash |= 0;
    }
    return hash
  }


}
