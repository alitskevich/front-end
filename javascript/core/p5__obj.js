const __PROPERTY = ((Get, Set) => {
  return (Value) => struct.PropertyDescriptor({
    Value, 
    Get, Set, 
    Writable, Enumerable, Configurable: TRUE
  })
})((This, Prop) => Prop.Value, (This, Prop, Value) => { Prop.Value = Value })

const __PROPERTY_LOOKUP = (This, Key) =>{
    for (let target = This; target; target = target.Proto) if (Key in target.Props) {
      return target.Props[Key];
    }
    return UNDEFINED
}
/**
 * $$REFLECT is the only bridge to access to object(its prototype and properties) from the code.
 */
const $$REFLECT = {
  // prototype access
  GetPrototypeOf(This){
    return This.Proto
  },
  SetPrototypeOf(This, Value){
    This.Proto = Value
  },
  // properties access
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
  OwnKeys: (This) => Object.keys(This.Props),
  GetOwnPropertyDescriptor: (This, Key) => This.Props[Key],
  DeleteProperty: (This, Key) => { delete This.Props[Key] },
  Has(This, Key) {
    return __PROPERTY_LOOKUP(This, Key) === UNDEFINED ? FALSE : TRUE
  },
  Get(This, Key) {
    const Prop = __PROPERTY_LOOKUP(This, Key)
    return Prop === UNDEFINED ? UNDEFINED : Prop.Get(This, Prop)
  },
  Set(This, Key, Value) {
    const Prop = __PROPERTY_LOOKUP(This, Key)
    if (Prop === UNDEFINED ) {
      ASSERT(This.Extensible, `Property '${Key}' is not extensible`);
      This.Props[Key] = __PROPERTY(value);
    } else {
      ASSERT(Prop.Set, `Property '${Key}' is read only`);
      p.Set(T, p, Value);
    }
  },
  // evaluation:
  // Calls a target function with arguments as specified by the args parameter.
  Apply(This, ThisArg, Arguments) {
    $$THROW(`TypeError: ${This} is not a function`);
  },
  // The new operator as a function. Equivalent to calling new target(...args).
  Construct(This, Arguments) {
    $$THROW(`TypeError: ${This} is not a constructor`);
  }
}
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
    // despite root itself has no proto, 
    // `__Proto__` property will be useful for its descendants
    __Proto__: structs.PropertyDescriptor({
      Getter: This => This.Proto,
      Setter: (This, Ref) => (This.Proto = Ref),
      Writable: TRUE,
      Enumerable: FALSE,
      Configurable: FALSE
    }),
    // returns object value
    ValueOf: __PROPERTY(This => This),
    // string representation
    ToString: __PROPERTY(This => `[object ${This.ClassName}]`),
    // string representation with locale
    ToLocaleString: __PROPERTY(This => This.String(This)),
    // check if object has own property by given name
    HasOwnProperty: __PROPERTY((This, Key) => (Key in This.Props)),
    // check if given property is enumerable
    PropertyIsEnumerable: __PROPERTY((This, Key) => {
      const Prop = __PROPERTY_LOOKUP(This, Key)
      return Prop === UNDEFINED ? FALSE : Prop.Enumerable;
    }),
    // getters/setters access
    __LookupGetter__: __PROPERTY((This, Key) => {
      const Prop = __PROPERTY_LOOKUP(This, Key)
      return Prop === UNDEFINED ? UNDEFINED : Prop.Get
    }),
    __LookupSetter__: __PROPERTY((This, Key) =>{
      const Prop = __PROPERTY_LOOKUP(This, Key)
      return Prop === UNDEFINED ? UNDEFINED : Prop.Set
    }),
    __DefineGetter__: __PROPERTY((This, Key, fn) => {
      const Prop = This.Props[Key]
      if (Prop) {
        $$ASSERT(Prop.Configurable, `TypeError: Cannot redefine property: ${Key}`);
        Prop.Get = fn;
      } else {
        This.Props[Key] = struct.PropertyDescriptor({ 
          Get: fn, IsEnumerable: TRUE, IsConfigurable: TRUE 
        })
      }
    }),
    __DefineSetter__: __PROPERTY((This, Key, fn) => {
      const Prop = This.Props[Key]
      if (Prop) {
        $$ASSERT(Prop.Configurable, `TypeError: Cannot redefine property: ${Key}`);
        Prop.Set = fn;
      } else {
        This.Props[Key] = struct.PropertyDescriptor({ 
          Set: fn, IsEnumerable: TRUE, IsConfigurable: TRUE 
        })
      }
    }),
    // check if given X is prototype of This
    IsPrototypeOf: __PROPERTY((This, X) => { 
      for (let target = This.Proto; target; target = target.Proto) if (X === target) {
          return TRUE;
      }
      return FALSE;
    })
  })
})

const $$OBJ = (KeyValues, Proto, Reflect, Extensible, Exotic, Name) => {
  const Props = {}
  for (let Key in KeyValues) {
    Props[Key] = __PROPERTY(KeyValues[Key])
  }
  return struct.Object({
    Props,
    Proto: Proto || $$ROOT,
    Reflect: Reflect || $$REFLECT,
    Extensible: Extensible || TRUE,
    Exotic: Exotic || UNDEFINED,
    ClassName: Name || "Object"
  })
}

