/**
 * String Utils.
 */

/**
 * Transforms given value as capitalized string like 'abc'->'Abc'.
 *
 * @param x
 * @returns {string}
 */
export function capitalize(x) {

  if (!x) {
    return '';
  }

  const s = '' + x;

  return s[ 0 ].toUpperCase() + s.slice(1);

}

/**
 * Transforms given value as string in camelCase like 'abc_def'->'abcDef'
 *
 * @param x
 * @param separator optional separator
 * @returns {string}
 */
export function camelCase(x, separator = '_') {

  if (!x) {
    return '';
  }

  const parts = `${x}`.split(separator);

  return parts[ 0 ] + parts.slice(1).map(capitalize).join('');
}

export const mirror = (x) => (x || '').split('').reduce((r, c)=>(c + r), '');

export default {
    // returns capitalized `s`
    capitalize,
    // returns camelized `s`
    camelize: (s, sep = '_') => (s && s.length && s.split(sep).map((t, i) =>(i ? capitalize(t) : t)).join('') || ``),
    // Returns string formatted by `s`-template filled with rest of arguments.
    format: (s, ...args) => (s && s.length && s.replace(/\{(\d+)\}/g, (_, d) => (args[+d] || '')) || ''),
    snakeCase:(x) => (x || '').replace(/([a-z])([A-Z])/g, '$1_$2'),
    mirror
};
