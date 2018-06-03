function TO_OBJECT (V) {
  if (V === UNDEFINED || V === NULL) {
      return $$THROW(`TypeError:Cannot convert undefined or null to object`);
  }
  switch (TYP(V)) {
      case TYPE_OBJECT:
      return V
      case TYPE_STRING:
      return TString(V)
      case TYPE_NUMBER:
      return TNumber(V)
  } 
}

const OBJ_ACCESS = ($) => TO_OBJECT($).Reflect

const PROP_GET = ($, key) => {
  if ($ === UNDEFINED || $ === NULL) { 
    THROW(`TypeError:Cannot read property '${key}' of ${TO_STRING($)}`)
  } else {
    return OBJ_ACCESS($).Get($, key);
  }
}
const PROP_SET = ($, key, value) => {
  if ($ === UNDEFINED || $ === NULL) {
    THROW(`TypeError:Cannot set property '${key}' of ${TO_STRING($)}`)
  } else {
    return OBJ_ACCESS($).Set($, key, value)
  }
}
const PROP_DEL = ($, key) => OBJ_ACCESS($).DeleteProperty($obj, key)

const APPLY_FUNCTION = ($, This, Arguments) => OBJ_ACCESS($).Apply($, This, Arguments)

const APPLY_METHOD = (This, Name, ...Args) => APPLY_FUNCTION(GET_PROP(This, Name), This, Args)

const NEW = ($, ...args) => OBJ_ACCESS($).Construct($, args);

const VAR_GET = (name) => VAR_LOOKUP(name).Ref
const VAR_SET = (name, Value) => {return VAR_LOOKUP(name).Ref = Value }