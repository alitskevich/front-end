/**
 * types
 */
export const TYPE_UNDEFINED = -1;
export const TYPE_NULL = -2;
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
export const TYPE_SYMBOL =	8;
export const TYPE_MAP = 13;

/**
 * Global pointers instances
 */
export const UNDEFINED = (TYPE_UNDEFINED);
export const NULL = (TYPE_NULL);
export const NAN = (TYPE_NOT_A_NUMBER);
export const ZERO = (TYPE_INT_ZERO);
export const STRING_EMPTY = (TYPE_STRING_EMPTY);
