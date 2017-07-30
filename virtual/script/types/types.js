
export const TYPES = {
  UNDEFINED: -1,
  NULL: 0,
  NUMBER_ZERO: 1,
  BOOLEAN_FALSE: 2,
  NOT_A_NUMBER: 4,
  STRING_EMPTY: 0x5,
  BOOLEAN_TRUE: 6,
  NUMBER: 7,
  STRING: 0x8,
  SYMBOL:	8,
  FUNCTION: 10,
  OBJECT: 11,
  ARRAY: 12,
  HASH: 13
};

/**
 *
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/typeof
 */
export const TYPE_NAMES = {
  Any: 'any',
  Undefined: 'undefined',
  Null: 'object',
  Boolean: 'boolean',
  Number: 'number',
  String: 'string',
  Symbol:	'symbol',
  Function: 'function',
  Object: 'object',
  Array: 'object',
  Date: 'object',
  Error: 'object'
};

export const typeOf = ctr => TYPE_NAMES[ctr.name.slice(0, -4)];
