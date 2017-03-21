const props = $ => $.constructor.$PROPS;

/**
 * A Property is an proxy on given key-value of a component state.
 */
export default class Property {

  static props = props;

  static has($, key) {

    return props($).has(key);
  }

  static get($, key) {

    const prop = props($).get(key);

    return !prop ? Object.undefined : prop.get(key, $.state, $);
  }

  static install(ctor, _props = ctor['PROPS'] || {}) {

    if (ctor.hasOwnProperty('$PROPS')) {
      return;
    }

    ctor.$PROPS = new Map();

    const keys = ctor.$PROP_KEYS = Object.keys(_props);
    keys.forEach(key => {

      const p = _props[key];
      const prop = new Property(key, p);

      ctor.$PROPS.set(key, prop);

      let def = null;
      if (!prop.isWriteOnly && !(ctor.prototype.__lookupGetter__(key))) {
        def = {};
        def.get = function () { return prop.get(this, key);};
      }
      if (!prop.isReadOnly && !(ctor.prototype.__lookupSetter__(key))) {
        def = def || {};
        def.set = function (value) { return this.set(key, value);};
      }
      if (def) {
        Object.defineProperty(ctor.prototype, key, def);
      }
    });
  }

  static diff($, delta) {

    const diff = { info:[], payload: {} };

    if (delta) {

      props($).forEach((prop, key) => {

        const oldValue = $.state[key];
        const value = delta[key];

        if (!prop.isReadOnly) {

          if ((typeof value !== 'undefined') &&
             !prop.isEqual(oldValue, value)) {

            diff.info.push({ key, prop, value, oldValue });

            diff.payload[key] = value;
          }
        }
      });
    }

    diff.isEmpty = !diff.info.length;

    return diff;
  }

  static update($, payload) {

    if (payload) {

      props($).forEach((prop, key) => {

        if (!prop.isReadOnly) {

          const value = payload[key];

          if (typeof value !== 'undefined') {

            prop.set($, key, value);
          }
        }
      });
    }

    return $;
  }

  constructor(key, options) {

    this.key = key;

    Object.assign(this, options);
  }

  isEqual(a, b) {

    return a === b;
  }

  get($, key) {

    const value = $.state[key];

    return value === Object.undefined ? this.default : value;
  }

  set($, key, value) {

    $.state[key] = value;
  }
}
