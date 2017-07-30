
/**
 * Null object type.
 */
// Everything in JavaScript ACTS like an object except null and undefined.
export const NULL_PROPERTY = $Tuple(-1,
  ($, key) => fnThrow(`Cannot read property '${key}' of null`, TypeError),
  ($, key, value) => fnThrow(`Cannot set property '${key}' of null`, TypeError),
  $false,
  $false,
  $false
);

export const NullPrototype = {
  __lookupGetter: () => Read(UNDEFINED_PROPERTY),
  __lookupSetter: () => Read(UNDEFINED_PROPERTY, ONE),
  toString: () => 'null'
};
