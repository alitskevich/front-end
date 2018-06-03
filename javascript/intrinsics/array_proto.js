const ArrayPrototype = {
  Length: struct.PropertyDescriptor({
    Get: (This) => LEN(This.Value),
    Set: (This, value) => SET_LEN(This.Value, value),
    Enumerable: FALSE,
    Configurable: FALSE
  }),
  Push: (This, V) => {
    ARR_PUSH(This.Value, value);
  },
  ForEach(This, fn) {
    const len = LEN(This.Value);
    for (let index = 0; index < len; index++) {
      APPLY(fn, NULL, ARR_AT(This, index), index, This);
    }
  },
  Reduce(This, fn, initialValue) {
    const len = LEN(This.Value);
    let result = initialValue;
    for (let index = 0; index < len; index++) {
      result = APPLY(fn, NULL, result, ARR_AT(This, index), index, This);
    }
    return result;
  },
  Map(This, fn) {
    const len = LEN(This.Value);
    const result = ARR(len);
    for (let index = 0; index < len; index++) {
      const item = ARR_AT(This, index)
      ARR_PUSH(result, APPLY(fn, NULL, item, index, This));
    }
    return ARRAY(result);
  },
  Filter(This, fn) {
    const len = LEN(This.Value);
    const result = ARR(len);
    for (let index = 0; index < len; index++) {
      const item = ARR_AT(This, index)
      if (TO_BOOLEAN(APPLY(fn, NULL, item, index, This))===TRUE){
        ARR_PUSH(result, item);
      }
    }
    return ARRAY(result);
  },
  IndexOf(This, X) {
    const len = LEN(This.Value)
    const result = ARR(len)
    for (let index = 0; index < len; index++) {
      const item = ARR_AT(This, index)
      if (EQUAL(item, X)) {
        return index;
      }
    }
    return UNDEFINED;
  },
  Join(This, sep = '') {
    const len = $$ARR_LEN(This.Value)
    let result = '';
    for (let index = 0; index < len; index++) {
      const item = ARR_AT(This, index);
      result += (index ? sep : '') + TO_STRING(item);
    }
    return STR(result)
  },
  ToString(This) {
    return $$CALL_METHOD(This, 'Join', ', ');
  }
};
