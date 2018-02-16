/**
 * types
 */
import { MAKE } from './alloc';

export const TYPE_UNDEFINED = -1;
export const TYPE_NULL = 0;
export const TYPE_NOT_A_NUMBER = -4;

export const TYPE_BOOL_FALSE = -8;
export const TYPE_BOOL_TRUE = -9;

export const TYPE_ZERO = -32;
export const TYPE_STRING_EMPTY = -64;

export const TYPE_ANY = 1;

export const TYPE_INFINITE_NUMBER = 4;
export const TYPE_STRING = 5;
export const TYPE_NUMBER = 6;
export const TYPE_NUMBER_NEGATIVE = 7;
export const TYPE_SYMBOL = 8;
export const TYPE_MAP = 13;
export const TYPE_FUNCTION = 15;
export const TYPE_OBJECT = 16;

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
  SYMBOL: 8,
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
  Symbol: 'symbol',
  Function: 'function',
  Object: 'object',
  Array: 'object',
  Date: 'object',
  Error: 'object'
};

/**
 * Global pointers instances
 */
export const UNDEFINED = (TYPE_UNDEFINED);
export const NULL = (TYPE_NULL);
export const NAN = (TYPE_NOT_A_NUMBER);
export const ZERO = (TYPE_ZERO);
export const STRING_EMPTY = (TYPE_STRING_EMPTY);

export const FALSE = MAKE(TYPE_BOOL_FALSE);// 0
export const TRUE = MAKE(TYPE_BOOL_TRUE);// 1
