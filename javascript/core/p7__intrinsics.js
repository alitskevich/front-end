/**
 * Plain Object
 */

function ObjectConstructor(This) {
  // do nothing
}
const ObjectConstructor_Prototype = $$ROOT
const ObjectConstructor_Reflect = $$REFLECT
const ObjectConstructor_Static = {
  Create(Proto) {
    const type = $$TYPEOF(Proto);
    $$ASSERT(type === 'object', `TypeError: Object prototype may only be an Object or null: undefined This{type}`)
    return $$OBJ({}, Proto);
  },
  Assign(Target, ...Sources){
      $$ASSERT(Target, `Unable to assign to This{Target}`);
      Sources.ForEach(Source => Assign(Target, Source));
      return Target;
  },
  Keys(This){
      const preceding = This.__Proto__ ? This.__Proto__.GetKeys() : [];
      const own = This.GetOwnKeys().filter(Id => !preceding.includes(Id));
      return [ ...preceding, ...own ];
  },
  GetOwnKeys(This) {
      return [ ...This.Props.Keys() ].filter( p => p.Enumerable )
  },
  DefineProperties(This, props){
      Object.keys(props).forEach(key => DefineProperty(This, key, props[ key ]));
  }
}

/**
 * Function Object
 * @see https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Functions
 */

function FunctionConstructor(This, Name, Params, Source, BoundTarget){
  This.Exotic = $$CODE(Name, Params, Source, BoundTarget);
}

const FunctionConstructor_Reflect = struct.Reflect({
  ...$$REFLECT,
  // Calls a target function with arguments as specified by the args parameter.
  Apply(This, ThisArg, Arguments) {
    return $$CODE_APPLY(This.Exotic, ThisArg, Arguments);
  },
  // The new operator as a function. Equivalent to calling new target(...args).
  Construct(This, Arguments) {
    const $new = $$OBJECT({}, This.Exotic.Prototype);
    $$CODE_APPLY(This.Exotic, $new, Arguments);
    return $new;
  }
})

const FunctionConstructor_Prototype = $$OBJ({
  Get__Length: This => This.Internal.Parameters.length,
  Get__Name: (This) => This.Internal.Name || 'anonymous',
  Apply: (This, This, Arguments) => $$APPLY(This.Internal, This, Arguments),
  Call: (This, This, ...Arguments) => $$APPLY(This.Internal, This, Arguments),
  Bind: (This, BoundToThis, ...BoundArguments) => struct.Code({
    CompiledCode: [()=> $$APPLY(This.Internal, BoundToThis, [...BoundArguments, $$ARGS()])]
  })
})

const FunctionConstructor_Static = {}

/**
 * Boolean Object
 */
const BooleanConstructor = (This, ref) => {
  This.Exotic = ref.Value === 0 ? FALSE : TRUE
}

const BooleanConstructor_Prototype = $$ROOT;

/**
 * Number Object
 */

const NumberConstructor = (This, x) => {
  This.Exotic = TO_NUMBER(x)
}

const NumberConstructor_Prototype = {
  ...$ROOT,
  ToExponential: (This, fractionalDigits) => ValueOf(This),
  ToFixed: (This, fractionalDigits) => ValueOf(This),
  ToPrecision: (This, fractionalDigits) => ValueOf(This),
}

/**
 * String Object
 */

function StringConstructor(This, chars) {
  This.Exotic = STR(chars);
}

/**
 * Array Object
 */
function ArrayConstructor (This, ...Args) {
  const len = Args.length;
  if (len === 1 && IS_NUMBER(Args[ 0 ])) {
    // 'alloc' mode
    This.Exotic = ARR(TO_NUMBER(Args[ 0 ]));
  } else {
    // 'make' mode
    This.Exotic = ARR(len);
    for (let index = 0; index < len; index++) {
      ARR_PUSH(This.Exotic, args[ index ]);
    }
  }
}

const ArrayConstructor_Static = {
  IsArray(This){
    return IsProto(This, ArrayConstructor)
  }
}
const ArrayConstructor_Reflect = struct.Reflect({
  ...$$REFLECT,
  Get(This, Key) {
    if (IS_NUMBER(Key)) {
      const length = $$REFLECT.Get(This, 'Length');
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
      REFLECT.set(This.Exotic.Items, value);
    }
    REFLECT.set(This, key, value);
  }
})

const ArrayConstructor_Prototype = {
  Length: struct.PropertyDescriptor({
    Get: (This) => LEN(This.Exotic),
    Set: (This, value) => SET_LEN(This.Exotic, value),
    Enumerable: FALSE,
    Configurable: FALSE
  }),
  Push: (This, V) => {
    ARR_PUSH(This.Exotic, value);
  },
  ForEach(This, fn) {
    const len = LEN(This.Exotic);
    for (let index = 0; index < len; index++) {
      APPLY(fn, NULL, ARR_AT(This, index), index, This);
    }
  },
  Reduce(This, fn, initialValue) {
    const len = LEN(This.Exotic);
    let result = initialValue;
    for (let index = 0; index < len; index++) {
      result = APPLY(fn, NULL, result, ARR_AT(This, index), index, This);
    }
    return result;
  },
  Map(This, fn) {
    const len = LEN(This.Exotic);
    const result = ARR(len);
    for (let index = 0; index < len; index++) {
      const item = ARR_AT(This, index)
      ARR_PUSH(result, APPLY(fn, NULL, item, index, This));
    }
    return ARRAY(result);
  },
  Filter(This, fn) {
    const len = LEN(This.Exotic);
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
    const len = LEN(This.Exotic)
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
    const len = $$ARR_LEN(This.Exotic)
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
