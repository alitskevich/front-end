/**
 * Undefined object type.
 */
// Everything in JavaScript ACTS like an object except null and undefined.
export const UNDEFINED_PROPERTY = $Tuple(-1,
  ($, key) => fnThrow(`Cannot read property '${key}' of undefined`, TypeError),
  ($, key, value) => fnThrow(`Cannot set property '${key}' of undefined`, TypeError),
  $false,
  $false,
  $false
);

export const UndefinedPrototype = {
    __lookupGetter: () => Read(UNDEFINED_PROPERTY),
    __lookupSetter: () => Read(UNDEFINED_PROPERTY, ONE),
    ToString: () => 'undefined'
};

export const $undefined = $Tuple(UNDEFINED, ZERO, ZERO, UndefinedPrototype);
