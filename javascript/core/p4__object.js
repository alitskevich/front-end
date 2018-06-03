const $$PROP = ((Getter, Setter) => {
  return (Value) => struct.PropertyDescriptor({
    Value,
    Getter, Setter,
    Writable, Enumerable, Configurable: TRUE
  })
})((This, Prop) => Prop.Value, (This, Prop, Value) => { Prop.Value = Value })

/**
 * $$REFLECT is the only bridge to access to object prototype and properties from the code.
 */
const $$REFLECT = HASH({
  // prototype access
  GetPrototypeOf: This => This.Proto,
  SetPrototypeOf: (This, Value) => (This.Proto = Value),

  IsExtensible(This){
    return This.Extensible
  },
  PreventExtensions(This) {
     This.Extensible = FALSE 
  },
  DefineProperty(This, Key, Initials) {
    const Prop = This.Props[Key]
    $$ASSERT(!Prop || Prop === Initials, `TypeError: Cannot redefine property: ${Key}`);
    This.Props[Key] = struct.PropertyDescriptor(Initials)
  },
  OwnKeys: (This) => HASH_KEYS(This.Props),
  GetOwnPropertyDescriptor: (This, Key) => HASH_GET(This.Props, Key),
  DeleteProperty: (This, Key) => HASH_DEL(This.Props, Key),
  Has(This, Key) {
    for (let target = This; target; target = target.Reflect.getPrototypeOf(target)) if (Key in target.Props) {
      return TRUE;
    }
    return FALSE
  },
  Get(This, Key) {
    for (let target = This; target; target = target.Reflect.getPrototypeOf(target)) if (Key in target.Props) {
      const Prop = target.Props[Key]
      return Prop.Getter(This, Prop);
    }
    return UNDEFINED
  },
  Set(This, Key, Value) {
    for (let target = This; target; target = target.Reflect.getPrototypeOf(target)) if (Key in target.Props) {
      const Prop = target.Props[Key]
      ASSERT(p.Setter, `property '${Key}' is read only`);
      p.Setter(T, p, Value);
      return
    }
    ASSERT(This.Extensible, `Property '${Key}' is not extensible`);
    This.Props[Key] = $$PROP(value);
  },
  // ---------------------------------
  // private, to be used in $$OBJ_ROOT
  __IsPrototypeOf__(This, X) {
    let target = This.Reflect.GetPrototypeOf(This)
    for (; target; target = target.Reflect.getPrototypeOf(target)) if (X === target) {
        return TRUE;
    }
    return FALSE;
  },
  __PropertyIsEnumerable__(This, Key) {
    for (let target = This; target; target = target.Reflect.getPrototypeOf(target)) if (Key in target.Props) {
      return target.Props[ Key ].Enumerable;
    }
    return FALSE;
  },
  __LookupGetter__(This, Key) {
    for (let target = This; target; target = target.Reflect.getPrototypeOf(target)) if (Key in target.Props) {
      return target.Props[ Key ].Getter;
    }
    return UNDEFINED;
  },
  __LookupSetter__(This, Key) {
    for (let target = This; target; target = target.Reflect.getPrototypeOf(target)) if (Key in target.Props) {
      return target.Props[ Key ].Setter;
    }
    return UNDEFINED;
  },
  __DefineGetter__(This, Key, fn) {
    const Prop = HASH_GET(This.Props, Key)
    if (Prop) {
      Prop.Getter = fn;
    } else {
      This.Props[Key] = struct.PropertyDescriptor({
        Getter: fn,
        IsEnumerable: TRUE,
        IsConfigurable: TRUE
      })
    }
  },
  __DefineSetter__(This, Key, fn) {
    const Prop = HASH_GET(This.Props, Key)
    if (Prop) {
      Prop.Setter = fn;
    } else {
      This.Props[Key] = struct.PropertyDescriptor({
        Setter: fn,
        IsEnumerable: TRUE,
        IsConfigurable: TRUE
      })
    }
  },
  __ValueOf__: This => This.Exotic || This,
  // string representation
  __ToString__: (This) => This.Exotic !== UNDEFINED ? TO_STRING(This.Exotic) : `[object ${This.Proto.Constructor.Name}]`,
  // string representation with locale
  __ToLocaleString__: This => This.Reflect.__ToString__(This),
})

const $$REFLECT_FUNCTION = struct.Reflect({
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

/**
 * This is the default root object for entire object tree.
 * Has no proto.
 * Also provides set of common methods, available for all descendants.
 */
const $$ROOT = struct.Object({
  Exotic: UNDEFINED,
  Proto: NULL,
  Extensible: FALSE,
  Reflect: $$REFLECT,
  Props: Hash({
    // despite root itself has no proto, `__Proto__` property will be useful for its descendants
    __Proto__: structs.PropertyDescriptor({
      Getter: (This) => This.Reflect.getPrototypeOf(This),
      Setter: (This, V) => This.Reflect.setPrototypeOf(This, V),
      Writable: TRUE,
      Enumerable: FALSE,
      Configurable: FALSE
    }),
    // check if given X is prototype of This
    IsPrototypeOf: $$PROP((This, X) => This.Reflect.__IsPrototypeOf__(This,X)),
    // returns object value
    ValueOf: $$PROP(This => This.Reflect.__ValueOf__(This)),
    // string representation
    ToString: $$PROP(This => This.Reflect.__ToString__(This)),
    // string representation with locale
    ToLocaleString: $$PROP(This => This.Reflect.__ToLocaleString__(This)),
    // check if given property is defined by object itself(no prototype chain)
    HasOwnProperty: $$PROP((This, Key) => This.Reflect.Has(This, Key)),
    // check if given property is enumerable
    PropertyIsEnumerable: $$PROP((This, Key) => This.Reflect.__PropertyIsEnumerable__(This, Key)),
    // getters/setters access
    __LookupGetter__: $$PROP((This, Key) => This.Reflect.__LookupGetter__(This, Key)),
    __LookupSetter__: $$PROP((This, Key) => This.Reflect.__LookupSetter__(This, Key)),
    __DefineGetter__: $$PROP((This, Key, Fn) => This.Reflect.__DefineGetter__(This, Key, Fn)),
    __DefineSetter__: $$PROP((This, Key, Fn) => This.Reflect.__DefineSetter__(This, Key, Fn))
  })
})

const $$OBJECT = (KeyValues, Proto, Reflect, Extensible) => {
  const Props = HASH({})
  for (let Key in KeyValues) {
      Props[Key] = $$PROP_MAKE(KeyValues[Key])
  }
  return struct.Object({
      Props,
      Proto: Proto || $$ROOT,
      Reflect: Reflect || $$REFLECT,
      Extensible: Extensible || TRUE,
      Exotic: UNDEFINED
  })
}
