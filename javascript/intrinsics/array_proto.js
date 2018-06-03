const ArrayPrototype = {
  Length: struct.PropertyDescriptor({
    Get: ($) => LEN($.Value),
    Set: ($, value) => SET_LEN($.Value, value),
    Enumerable: FALSE,
    Configurable: FALSE
  }),
  Push: ($, V) => {
    ARR_PUSH($.Value, value);
  },
  ForEach($, fn) {
    const len = LEN($.Value);
    for (let index = 0; index < len; index++) {
      APPLY(fn, NULL, ARR_AT($, index), index, $);
    }
  },
  Reduce($, fn, initialValue) {
    const len = LEN($.Value);
    let result = initialValue;
    for (let index = 0; index < len; index++) {
      result = APPLY(fn, NULL, result, ARR_AT($, index), index, $);
    }
    return result;
  },
  Map($, fn) {
    const len = LEN($.Value);
    const result = ARR(len);
    for (let index = 0; index < len; index++) {
      const item = ARR_AT($, index)
      ARR_PUSH(result, APPLY(fn, NULL, item, index, $));
    }
    return ARRAY(result);
  },
  Filter($, fn) {
    const len = LEN($.Value);
    const result = ARR(len);
    for (let index = 0; index < len; index++) {
      const item = ARR_AT($, index)
      if (TO_BOOLEAN(APPLY(fn, NULL, item, index, $))===TRUE){
        ARR_PUSH(result, item);
      }
    }
    return ARRAY(result);
  },
  IndexOf($, X) {
    const len = LEN($.Value)
    const result = ARR(len)
    for (let index = 0; index < len; index++) {
      const item = ARR_AT($, index)
      if (EQUAL(item, X)) {
        return index;
      }
    }
    return UNDEFINED;
  },
  Join($, sep = '') {
    const len = LEN($.Value)
    let result = '';
    for (let index = 0; index < len; index++) {
      const item = ARR_AT($, index);
      result += (index ? sep : '') + TO_STRING(item);
    }
    return STR(result)
  },
  ToString($) {
    return CALL_METHOD($, 'Join', ', ');
  }
};
