// ----------------------------------------------
// Instantiate
// ----------------------------------------------

/**
 * Memory allocation.
 *
 * '$' means address
 */

const MEMORY = [];
const ADDR_INC = 0;

export function ALLOC(type, size, cap = size) {

  const capacity = (cap < size) ? size : cap;
  const bytes = ArrayBuffer(4 * capacity + 1);
  const view = new DataView(bytes, 0, size);

  view.setInt8(0, type);

  const $ = ADDR_INC++;
  MEMORY[$] = view;

  return $;
}

export function MAKE(type, ...args) {

  const size = args.length;

  const $ = ALLOC(type, size);

  const view = MEMORY[$];

  for (let i = 0; i < length; i++) {
    view.setUint32(4 * i + 1, args[i]);
  }

  return $;
}

export function RESIZE($, newSize, lag = 0) {
  if ($ < 0) {
    return;
  }
  if (newSize === SIZE($)) {
    return;
  }

  let view = MEMORY[$];
  let buff = view.buffer;

  let cap = buff.byteLen;
  let newCap = 4 * newSize + 1;
  let destView;

  if (cap < newCap) {
    buff = ArrayBuffer(newCap + lag);
    destView = new DataView(buff, 0, newCap);

    destView.setInt8(0, view.getUint8(0));
    for (let i = 0; i < newSize; i++) {
      let pos = 4 * i + 1;
      destView.setUint32(pos, view.getUint32(pos));
    }
  } else {
    destView = new DataView(buff, 0, newCap);
  }

  MEMORY[$] = destView;
}

export function DESTROY($) {
  if ($ < 0) {
    return;
  }
  delete MEMORY[$];
}

// ----------------------------------------------
// General
// ----------------------------------------------

/**
 * types
 */

export const TYPE_UNDEFINED = -1;
export const TYPE_NULL = -2;
export const TYPE_NOT_A_NUMBER = -4;

export const TYPE_BOOL_FALSE = -8;
export const TYPE_INT_ZERO = -16;
export const TYPE_FLOAT_ZERO = -32;
export const TYPE_STRING_EMPTY = -64;

export const TYPE_BOOL_TRUE = 8;
export const TYPE_INFINITE_NUMBER = 4;
export const TYPE_STRING = 5;
export const TYPE_NUMBER = 6;
export const TYPE_INT = 6;
export const TYPE_NUMBER_NEGATIVE = 6;
export const TYPE_PAIR = 7;
export const TYPE_SYMBOL =	8;
export const TYPE_TUPLE = 12;
export const TYPE_MAP = 13;

export function TYPE($) {

  return MEMORY[$].getInt8(0);
}

// false, null, undefined, NaN, 0 and "" are falsy; everything else is truthy.
export function TRUTHY(V) {

  return TYPE(V) > 0;
}

/**
 * Global pointers instances
 */

export const UNDEFINED = (TYPE_UNDEFINED);
export const NULL = (TYPE_NULL);
export const NAN = (TYPE_NOT_A_NUMBER);
export const ZERO = (TYPE_INT_ZERO);
export const FALSE = (TYPE_BOOL_FALSE);
export const STRING_EMPTY = (TYPE_STRING_EMPTY);
export const TRUE = (TYPE_BOOL_TRUE);

/**
 * Inspect
 */
export function SIZE($) {
  if ($ < 0) {
    return 0;
  }
  return (MEMORY[$].byteLength - 1) / 4;
}

export function GET($, offset) {
  if ($ < 0) {
    return UNDEFINED;
  }
  return MEMORY[$].getUint32(4 * offset + 1);
}

export function EQUALS($a, $b) {

  if ($a === $b && $a !== NAN) {
    return 1;
  }

  const Ta = TYPE($a);
  if (Ta !== TYPE($b)) {
    return 0;
  }

  if ($a < 0 || $b < 0) {
    return false;
  }

  const Sa = SIZE($a);
  if (Sa !== SIZE($b)) {
    return 0;
  }

  const Ba = MEMORY[$a].buffer;
  const Bb = MEMORY[$b].buffer;
  if (Ba === Bb && Ba.offset === Bb.offset) {
    return 1;
  }

  for (let i = 0; i < Sa; i++) {
    if (GET($a, i) !== GET($b, i)) {
      return 0;
    }
  }

  return 1;
}

export function INDEX_OF($, V) {
  if ($ < 0) {
    return -1;
  }

  for (let i = 0, length = SIZE($); i < length; i++) {

     const item = GET($, i);
     if (EQUALS(V, item)) {
       return i;
     }
   }

   return -1;
}

export function HASH($) {

  let hash = 0;
  const size = SIZE($);
  if (size === 0) {
    return hash;
  }
  const V = MEMORY[$];
  for (let i = 0; i < 4 * size; i += 4 ) {
    let chr = V.getUint32(i);
    hash = ((hash << 5) - hash) + chr;
    // Convert to 32bit integer
    hash |= 0;
  }
  return hash;
}

/**
 * Modify
 */
export function SET($, offset, val) {

  if ($ < 0) {
    return;
  }

  MEMORY[$].setUint32(4 * offset + 1, val);
}

export function SET64($, offset, val) {

  if ($ < 0) {
    return;
  }

  MEMORY[$].setUint64(4 * offset + 1, val);
}

export function COPY(size, $s, sOffset, $t, tOffset) {

  if ($s < 0 || $t < 0) {
    return;
  }
  const s = MEMORY[$s];
  const t = MEMORY[$t];

  const si = 4 * sOffset + 1;
  const ti = 4 * tOffset + 1;

  for (let i = 0; i < 4 * size; i += 4 ) {
    t.setUint32(ti + i, s.getUint32(si + i));
  }
}

// ----------------------------------------------
// Types
// ----------------------------------------------

/**
 * Int.
 */
export function INT(V) {

  if (V === 0) {
    return TYPE_INT_ZERO;
  }

  const $ = ALLOC(TYPE_INT, 2);

  SET64($, 0, V);

  return $;
}

/**
 * Int.
 */
export function STRING(V) {

  const size = V && V.length;

  if (size === 0) {
    return TYPE_STRING_EMPTY;
  }

  return MAKE(TYPE_STRING, V.split(''));
}

/**
 * Tuple.
 */
export function NEW_TUPLE(length, cap) {

  return ALLOC(TYPE_TUPLE, length, cap);
}

export function TUPLE(...args) {

  return MAKE(TYPE_TUPLE, ...args);
}

/**
 * Map
 */
export function MAP(...args) {

  const size = args.length / 2;

  if (size === 0) {
    return MAKE(TYPE_MAP, UNDEFINED, UNDEFINED, 0);
  }

  const $keys = NEW_TUPLE(size);
  const $values = NEW_TUPLE(size);

  const $ = MAKE(TYPE_MAP, $values, $keys, size);

  for (let i = 0; i < size; i += 2) {
    SET($values, i, args[i + 1]);
    SET($keys, i, args[i]);
  }

  return $;
}

export const MAP_VALUES = ($) => GET($, 0);
export const MAP_KEYS = ($) => GET($, 1);
export const MAP_SIZE = ($) => GET($, 2);
export const MAP_INDEX_OF_KEY = ($, $key) => INDEX_OF(MAP_KEYS($), $key);
export const MAP_HAS_KEY = ($, $key) => MAP_INDEX_OF_KEY($, $key) !== -1;

export const MAP_GET = ($, $key) => {

  const index = MAP_INDEX_OF_KEY($, $key);

  if (index === -1) {
    return UNDEFINED;
  }

  return GET(MAP_VALUES($), index);
};

export function MAP_SET($, $key, V) {

  let index = MAP_INDEX_OF_KEY($, $key);
  let $values = MAP_VALUES($);

  if (index === -1) {

    const size = MAP_SIZE($);
    index = size;

    RESIZE(MAP_KEYS($), size + 1, 5);
    RESIZE($values, size + 1, 5);
  }

  SET($values, index, V);
}
/**
 * Structures
 */
const REGISTRY = MAP();
const STRUCT_LAST_ID = 255;

export function struct(Id, aFields) {

  const $map = MAP();
  const typeId = STRUCT_LAST_ID++;
  const $ = MAKE(typeId, 0, $map);
  let size = 0;
  let offset = 0;

  for (let i = 0, length = SIZE(aFields); i < length; i++) {
    let f = GET(aFields, i);
    RESIZE(f, 3);
    let fName = GET(f, 0);
    let fType = GET(f, 1);
    MAP_SET(fName, MAKE(0, fName, fType, size));
    size += STRUCT_TYPE_SIZE(fType);
    struct[`f_${Id}_${fName}`] = offset;
    offset = size;
  }

  SET($, 0, size);
  MAP_SET(REGISTRY, name, STRUCT_TYPE(aFields));

  struct[Id] = (defs)=> {
    return $.keys().reduce((o, k)=>{
      o[k] = defs[k] || null;
      return o;
    }, {});
  };
  return $;
}

export function STRUCT_TYPE_SIZE(type) {
  let $ = MAP_GET(REGISTRY, type);
  if ($ === UNDEFINED) {
    return 1;
  }
  return GET($, 0);
}

export function STRUCT_DEF($) {

  MAP_GET(REGISTRY, GET($, 0));
}

export function STRUCT_FIELD_DEF($, name) {
  let $def = STRUCT_DEF($);
  let $f = MAP_GET($def, name);
  return $f;
}

export function STRUCT_FIELD_GET($, name, $to) {
  let $f = STRUCT_FIELD_DEF($, name);
  let size = GET($f, 1);
  let offset = GET($f, 2);
  for (let i = 0; i < size; i++) {
    SET($to, i, GET($, offset + i));
  }
}

export function STRUCT_FIELD_SET($, name, $from) {

  let $f = STRUCT_FIELD_DEF($, name);
  let size = GET($f, 1);
  let offset = GET($f, 2);

  for (let i = 0; i < size; i++) {
    SET($, offset + i, GET($from, i));
  }
}
export function STRUCT_FIELD_COPY($s, sname, $t, tName) {

  let $f = STRUCT_FIELD_DEF($s, sname);
  let $tf = STRUCT_FIELD_DEF($t, tName);

  let size = GET($f, 1);
  let sOffset = GET($f, 2);
  let tOffset = GET($tf, 2);

  COPY(size, $s, sOffset, $t, tOffset);

}

struct(`Context`, {
  Next: `Context`,
  Fn: `Function`,
  This: `Any`,
  Arguments:`[]Any`,
  VariableScope:`VariableScope`
});

struct(`VariableScope`, {
  Data: `Map`,
  Parent: `VariableScope`
});

struct(`Object`, {
  Meta: `Map`,
  Data: `Map`,
  Proto: `Object`
});

struct(`PropertyDecriptor`, {
  Getter: `Fn`,
  Setter: `Fn`,
  Value: `Any`,
  IsEnumerable: `bool`,
  IsConfigurable: `bool`
});

struct(`Function`, {
  Meta: `Map`,
  Data: `Map`,
  Proto: `Object`,

  Parameters: `[]String`,
  Code:'Any',
  Name:'String',
  BoundToThis: `Any`,
  // to be parent for a new variable scope in Apply()
  LexicalScope: `VariableScope`,
  Prototype: `Object`
});
/**
 * Property
 */
export function PROPERTY_DEFINE($, Id, Prop) {

  // const $prop = LookupPropertyDescriptor($, Id);
  // assert($prop.IsConfigurable, `property '${key}' is already defined`);

  // assert((IsReadOnly === $true) && Get, `No getter allowed for read-only property '${key}'`);

  MAP_SET($.Meta, Id, Prop);
}

const PROTO_PROPERTY = struct.PropertyDescriptor({
  Getter: ($, key) => $.Proto,
  Setter: ($, key, value) => {$.Proto = value;},
  IsEnumerable: FALSE,
  IsConfigurable: FALSE
});
/**
 * Object
 */
export function OBJECT(Proto, initials) {

  const $ = struct.Object({
    Meta: MAP(),
    Data: MAP(initials),
    Proto
  });

  if (Proto) {
    PROPERTY_DEFINE($, `__Proto__`, PROTO_PROPERTY);
  }

  return $;
}

export function OBJECT_GET($, Id) {

  const prop = lookupPropertyDescriptor($, Id);

  if (prop && prop.Value) {

    return prop.Value;
  }

  if (prop && prop.Getter) {

    return prop.Getter($, Id);
  }

	for (let target = $; target; target = target.Proto) {
		if (MAP_HAS_KEY(target.Data, Id)) {
			return MAP_GET(target.Data, Id);
		}
	}

  return UNDEFINED;
}

export function OBJECT_SET($, Id, Value) {

  const prop = lookupPropertyDescriptor($, Id);

  if (prop && prop.Setter) {

     prop.Setter($, Id, Value);
  } else {

    MAP_SET($.Data, Id, Value);
  }

  // assert(prop.IsReadOnly, `property '${key}' is read only`);

}

function lookupPropertyDescriptor($, Id) {

  // uses Proto chain if has no own property defined
  for (let target = $; target; target = $.Proto) {
    let prop = MAP_GET(target.Meta, Id);
		if (prop !== UNDEFINED) {
			return prop;
		}
	}

  return UNDEFINED;
}

function ensureProperty($, Id) {

  let prop = MAP_GET($.Meta, Id);

  if (prop === UNDEFINED) {
    prop = struct.PropertyDescriptor({
      IsEnumerable: TRUE,
      IsConfigurable: TRUE
    });
    PROPERTY_DEFINE($, Id, prop);
  }
  return prop;
}
/**
 * Root object instance
 */
const __lookupGetter__ = ($, Id)=>{
  const prop = lookupPropertyDescriptor($, Id);
  return prop ? prop.Getter : UNDEFINED;
};
const __lookupSetter__ = ($, Id)=>{
  const prop = lookupPropertyDescriptor($, Id);
  return prop ? prop.Setter : UNDEFINED;
};
const HasOwnProperty = ($, Id) => {

  return MAP_HAS_KEY($.Data, Id) || MAP_HAS_KEY($.Meta, Id);
};
const IsPrototypeOf = () => {
  return false;
};
const PropertyIsEnumerable = ($, Id) => {
  return lookupPropertyDescriptor($, Id).IsEnumerable;
};

const ROOT_STRING = STRING('[object Object]');

export const ROOT = struct.Object({
  Data: MAP({
    toString: ($) => ROOT_STRING,
    toLocaleString: ($) => ROOT_STRING,
    valueOf: ($)=>$,
    __defineGetter__: ($, Id, fn )=>{ ensureProperty($, Id).Getter = fn;},
    __defineSetter__: ($, Id, fn )=>{ ensureProperty($, Id).Setter = fn;},
    __lookupGetter__,
    __lookupSetter__,
    HasOwnProperty,
    IsPrototypeOf,
    PropertyIsEnumerable

  })
});

/**
 * Function
 */
export function FUNCTION(parameters, source, name, reciever) {

  // lazy translate source code into binary executable code

  const $ = struct.Function({
    Parameters: parameters || [],
    Name : name || '',
    BoundToThis: reciever,
    // to be parent for a new variable scope in Apply()
    LexicalScope: context.variableScope
  });

  // translate($);

  // to be referred as prototype by each object that newly constructed with this function
  $.Prototype = OBJECT(ROOT, { Constructor: $ });

  return $;
}

/**
 * Context
 */

let Context = {};

const lookupScopeFor = (Id)=>{
	for (let scope = Context.VariableScope; scope; scope = scope.Parent) {
		if (MAP_HAS_KEY(scope.Data, Id) ) {
			return scope;
		}
	}
	context.Error = new ReferenceError(`variable ${Id} is not defined`);
};

// GetVar method
export function VAR_GET(Id) {

  const scope = lookupScopeFor(Id);
  if (scope) {
    return MAP_GET(scope.Data, Id);
  }
}

// GetVar method
export function VAR_SET(Id, Value) {

  const scope = lookupScopeFor(Id);
  if (scope) {
     MAP_SET(scope.Data, Id, Value);
  }
}

export function FUNCTION_APPLY(Fn, This, Arguments) {

  let VariableScope = Context.VariableScope;

  if (Fn.parameters.length + Fn.localVariables.length) {
    const Data = MAP();
    // define parameters and initialize them with arguments values in order of appearance
    Fn.Parameters.forEach(Id => { MAP_SET(Data, Id, UNDEFINED);});
    // define all variables BEFORE any execution, e.g. Hoisting
    Fn.localVariables.forEach(Id => {MAP_SET(Data, Id, UNDEFINED);});
    // create a new variable scope exclosed by this function lexical scope
    VariableScope = struct.VariableScope({ Parent: Fn.LexicalScope, Data });
  }

  // create a new execution context for this invocation
  // and push it into execution stack
  const context = struct.Context({
    Next: Context,
    Fn,
    This: Fn.BoundToThis || This,
    Arguments,
    VariableScope
  });

  Context = context;
  // Evaluate binary code
    let index = 0, op = Fn.Code[index], len = Fn.Body.length;
    while (index < len && !context.Exit) {
      op.apply(context);
      op = Fn.Code[index++];
    }
  Context = context.Next;

  // to provide context.Result outside
  return context.Result;
}
