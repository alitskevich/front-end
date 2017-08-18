/**
 * String.
 */
import { TYPE_STRING, TYPE_STRING_EMPTY } from './_const';
import { GET, MAKE, SIZE, TYPE } from './alloc';

export function STRING(S) {

  const size = S && S.length;

  if (size === 0) {
    return TYPE_STRING_EMPTY;
  }

  if (typeof S === 'string') {
    return MAKE(TYPE_STRING, S.split('').map((ch,i)=>S.charCodeAt(i)));
  }

  return S;
}

export function STRING_HASH(V) {
  const S=''+V;
  const size = S.length;
  let hash = 0;
  if (size === 0) {
    return hash;
  }
  for (let i = 0; i < size; i ++) {
    let chr = S.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    // Convert to 32bit integer
    hash |= 0;
  }
  return hash;
}

export function STRING_INDEX_OF($, V) {

  for (let i = 0, length = SIZE($); i < length; i++) {

    const item = GET($, i);
    if (EQUALS(V, item)) {
      return i;
    }
  }

  return -1;
}

export function STRING_INSPECT($) {

  const size = SIZE($);
  const type = TYPE($);
  if (type!==TYPE_STRING) {
    return "NOT_A_STRING"
  }
  const r=[];
  for (let i = 0; i < size; i++) {
    const e = GET($, i);
    r.push(String.fromCharCode(e));
  }
  return `"${r.join('')}"` ;

}