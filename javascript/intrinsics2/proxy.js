/**
 *
 *
 * @see https://github.com/GoogleChrome/proxy-polyfill/blob/master/proxy.js
 */
export const ProxyConstructor = ($, handler, target) => {
  $.Internal = target;
  $.Reflect = { ...ProxyReflect, handler };
};
/**
 * Reflect is a built-in object that provides methods to interact with objects associated to.
 */
export const ProxyReflect = struct.Reflect({

  Apply($, This, Arguments) {
    assert(`'$' is not a function`);
  },

  construct($, ...args) {
    assert(`'$' is not a constructor`);
  },

  defineProperty($, key, initials) {

    // const $prop = LookupProperty($, Id);
    // assert($prop.Configurable, `property '${key}' is already defined`);
    // assert((IsReadOnly === $true) && Get, `No getter allowed for read-only property '${key}'`);

    return $.Props[ key ] = struct.PropertyDescriptor(initials);
  },

  has($, key) {
    return lookupProperty($, key) !== UNDEFINED;
  },
  /**
   * Returns an array of the target object's own (not inherited) property keys.
   * @param $
   * @returns {Array}
   */
  ownKeys($) {
    return Object.keys($.Props)
  },

  getOwnPropertyDescriptor($, key) {
    return $.Props[ key ]
  },

  deleteProperty($, key) {
    delete $.Props
  },

  get($, key) {
    const prop = lookupProperty($, key);
    return prop ? prop.Getter($, prop) : UNDEFINED;
  },

  /**
   * A function that assigns values to properties.
   * Returns a Boolean that is true if the update was successful.
   * @param $
   * @param key
   * @param value
   */
  set($, key, value) {
    const prop = lookupProperty($, key);
    if (prop) {
      // assert(prop.Setter, `property '${key}' is read only`);
      prop.Setter($, value, prop);
    } else {
      // assert($.Extensible, `property '${key}' is not extensible`);
      $.Props[ key ] = createValueProperty(value);
    }
  },

  getPrototypeOf($) {
    return $.Proto;
  },

  setPrototypeOf($, value) {
    $.Proto = value;
  },

  isExtensible($) {
    return $.Extensible
  },

  preventExtensions($) {
    $.Extensible = FALSE;
  }
})