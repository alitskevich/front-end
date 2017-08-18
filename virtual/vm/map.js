/**
 * Map
 */
import { ALLOC, GET, MAKE, RESIZE, SET, SIZE, TYPE } from './alloc';
import { TYPE_ANY, TYPE_MAP, UNDEFINED } from './_const';
import { HASH } from './commons';
import { STRING } from './string';

export function MAP(initials) {

  const keys = initials ? Object.keys(initials) : [];
  const size = keys.length;

  if (size === 0) {
    return MAKE(TYPE_MAP, UNDEFINED, UNDEFINED, UNDEFINED);
  }

  const Keys = ALLOC(TYPE_ANY, size);
  const Hashes = ALLOC(TYPE_ANY, size);
  const Values = ALLOC(TYPE_ANY, size);

  const $ = MAKE(TYPE_MAP, Values, Keys, Hashes);

  keys.forEach((key, i)=> {
    SET(Values, i, initials[key]);
    SET(Keys, i, key);
    SET(Hashes, i, HASH(key));
  });

  return $;
}

export const MAP_VALUES = ($) => GET($, 0);
export const MAP_KEYS = ($) => GET($, 1);

export const MAP_SIZE = ($) => SIZE(MAP_KEYS($));

export const MAP_INDEX_OF_KEY = ($, key) => {

  const hkey = HASH(key);
  const $hkeys = GET($, 2);
  const size = SIZE($hkeys);

  for (let i = 0; i < size; i++) {
    const e = GET($hkeys, i);
    if (hkey === e) {
      return i;
    }
  }

  return -1;
};

export const MAP_HAS_KEY = ($, key) => MAP_INDEX_OF_KEY($, key) !== -1;

export const MAP_GET = ($, key) => {

  const index = MAP_INDEX_OF_KEY($, key);

  if (index === -1) {
    return UNDEFINED;
  }

  return GET(MAP_VALUES($), index);
};

export function MAP_SET($, key, V) {

  let index = MAP_INDEX_OF_KEY($, key);

  if (index === -1) {

    const size = MAP_SIZE($);
    index = size;

    RESIZE($, 0, size + 1, 5);
    RESIZE($, 1, size + 1, 5);
    RESIZE($, 2, size + 1, 5);

    SET(MAP_KEYS($), index, STRING(key));
    SET(GET($, 2), index, HASH(key));

  }

  SET(MAP_VALUES($), index, V);
}
