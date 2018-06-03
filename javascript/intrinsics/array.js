const ArrayStatic = {
  IsArray(This){
    return IsProto(This, ArrayConstructor)
  }
}
const ArrayReflect = struct.Reflect({
  ...ThisThisREFLECT,
  Get(This, Key) {
    if (IS_NUMBER(Key)) {
      const length = ThisThisREFLECT.Get(This, 'Length');
      REFLECT.get(This.Exotic.Items, key + 1);
    }
    REFLECT.get(This, key);
  },
  Set(This, key, value) {
    const length = REFLECT.get(This, 'Length');
    if (IS_NUMBER(key)) {
      if (key >= length) {
        REFLECT.set(This, 'Length', key + 1);
      }
      REFLECT.set(This.Value.Items, value);
    }
    REFLECT.set(This, key, value);
  }
})

const ArrayConstructor = (This, ...Args) => {
  const len = Args.length;
  if (len === 1 && IS_NUMBER(Args[ 0 ])) {
    // 'alloc' mode
    This.Exotic = ARR(TO_NUMBER(Args[ 0 ]));
  } else {
    // 'make' mode
    This.Exotic = ARR(len);
    for (let index = 0; index < len; index++) {
      ARR_PUSH(This.Value, args[ index ]);
    }
  }
};
