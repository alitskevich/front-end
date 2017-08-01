

/**
 * Map
 */
export function MAP(...args) {

  const size = args.length / 2;

  if (size === 0) {
    return MAKE(TYPE_MAP, UNDEFINED, UNDEFINED, 0);
  }

  const $keys = ALLOC(TYPE_ANY, size);
  const $values = ALLOC(TYPE_ANY, size);

  const $ = MAKE(TYPE_MAP, $values, $keys, size);

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

    RESIZE($+0, size + 1, 5);
    RESIZE($+1, size + 1, 5);
  }

  SET($values, index, V);
}
