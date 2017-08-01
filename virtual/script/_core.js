import { ALLOC, MAKE, GET, SET, SIZE, TYPE, RESIZE} from './_alloc';

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
export const TYPE_BOOL_TRUE = -9;

export const TYPE_ZERO = -32;
export const TYPE_STRING_EMPTY = -64;

export const TYPE_ANY = 1;

export const TYPE_INFINITE_NUMBER = 4;
export const TYPE_STRING = 5;
export const TYPE_NUMBER = 6;
export const TYPE_NUMBER_NEGATIVE = 7;
export const TYPE_SYMBOL =	8;
export const TYPE_MAP = 13;

/**
 * Global pointers instances
 */
export const UNDEFINED = (TYPE_UNDEFINED);
export const NULL = (TYPE_NULL);
export const NAN = (TYPE_NOT_A_NUMBER);
export const ZERO = (TYPE_INT_ZERO);
export const STRING_EMPTY = (TYPE_STRING_EMPTY);

export const FALSE = MAKE(TYPE_BOOL_FALSE);// 0
export const TRUE = MAKE(TYPE_BOOL_TRUE);// 1

/**
 * Inspection
 */

// false, null, undefined, NaN, 0 and "" are falsy; everything else is truthy.
export function TRUTHY($) {

  return $ === 1 || TYPE($) > 0;
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

  for (let i = 0; i < Sa; i++) {
    if (GET($a, i) !== GET($b, i)) {
      return 0;
    }
  }

  return 1;
}

export function INDEX_OF($, V) {

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
  for (let i = 0; i < 4 * size; i += 4 ) {
    let chr = MEMORY.getUint32($+i);
    hash = ((hash << 5) - hash) + chr;
    // Convert to 32bit integer
    hash |= 0;
  }
  return hash;
}

// ----------------------------------------------
// Types
// ----------------------------------------------

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
 * Map
 */
export function MAP(...args) {

  const size = args.length / 2;

  if (size === 0) {
    return MAKE(TYPE_MAP, UNDEFINED, UNDEFINED, 0);
  }

  const $keys = ALLOC(TYPE_ANY, size);
  const $values = ALLOC(TYPE_ANY, size);

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

    RESIZE($+0, size + 1, 5);
    RESIZE($+1, size + 1, 5);
  }

  SET($values, index, V);
}
/**
 * Structures
 */

export function struct(id, fields) {

  const keys = fields.keys()
  const proto = keys.reduce((o, key, index)=>{
    Object.defineProperty(o, key, {
      get() {
        return GET(this.$, index)
      },
      set(V) {
        SET(this.$, index, V)
      }
    });
    return o;
  }, {})

  struct[id] = (defs)=> Object.assign(Object.create(proto),
    {$: MAKE(TYPE_ANY, keys.map((o, key, index)=>defs[key]||0))}
  );
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
  Primitive: `*`,
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
  Parameters: `[]String`,
  Code:'*',
  NativeCode:'*',
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
export function OBJECT(proto, initials) {

  const $ = struct.Object({
    Meta: MAP(),
    Data: MAP(initials),
    Proto: Proto,
  });

  if (proto) {
    PROPERTY_DEFINE($, `__Proto__`, PROTO_PROPERTY);
  }

  return $;
}

export function NEW_OBJECT(ctor, ...args) {

  const $ = OBJECT(ctor.Primitive.Prototype, {});

  FUNCTION_APPLY(ctor, $, ...args)

  return $;
};

export function OBJECT_GET($, Id) {

  if ($<0){
    // ($, key) => fnThrow(`Cannot read property '${key}' of undefined`, TypeError),
    return UNDEFINED;
  }

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

  if ($<0){
    // ($, key, value) => fnThrow(`Cannot set property '${key}' of undefined`, TypeError),
    return;
  }

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
const hasOwnProperty = ($, Id) => {

  return MAP_HAS_KEY($.Data, Id) || MAP_HAS_KEY($.Meta, Id);
};
const isPrototypeOf = () => {
  return false;
};
const propertyIsEnumerable = ($, Id) => {
  return lookupPropertyDescriptor($, Id).IsEnumerable;
};

const toString = ($) => `[object ${OBJECT_GET($, 'Proto.Constructor').name}]`;

export const ObjectConstructor = FUNCTION({

  Name : 'Object',

  Prototype: ROOT,

  NativeCode($, ...Arguments) {

    $.Primitive = $.Data;
  }

});

Assign(ObjectConstructor, {

   Create(prototype) {

     const type = $typeOf(prototype);

     assert(type === 'object' || prototype === $null,
      `Object prototype may only be an Object or null: undefined ${type}`,
      TypeError
     );

     return $Object(prototype);
   },

   Assign(Target, ...Sources) {

     assert(Target, `Unable to assign to ${Target}`);

     Sources.forEach( Source => Assign(Target, Source));

     return Target;
   },

   Keys($) {

     const preceding = $.__Proto__ ? $.__Proto__.GetKeys() : [];

     const own = $.GetOwnKeys().filter(Id => !preceding.includes(Id));

     return [...preceding, ...own];
   },

   GetOwnKeys: ($) => [...$.Data.Keys()].filter(p => p.IsEnumerable).map(p => p.Id)

 });

export const ROOT = struct.Object({
  Data: MAP({
    valueOf: ($)=> $.Primitive,
    toString,
    toLocaleString: ($)=> FUNCTION_APPLY(OBJECT_GET($, 'toString'), $),
    __defineGetter__: ($, Id, fn )=>{ ensureProperty($, Id).Getter = fn;},
    __defineSetter__: ($, Id, fn )=>{ ensureProperty($, Id).Setter = fn;},
    __lookupGetter__,
    __lookupSetter__,
    hasOwnProperty,
    isPrototypeOf,
    propertyIsEnumerable
  })
});

/**
 * Function
 */
 const FUNCTION_PROTOTYPE = OBJECT(ROOT, {

   Apply: ($, This, Arguments) => FUNCTION_APPLY($.Primitive, This, Arguments),

   Call: ($, This, ...Arguments) => FUNCTION_APPLY($.Primitive, This, Arguments),

   Bind: ($, BoundToThis, ...Arguments) => NewFunction({ ...$, BoundToThis })
});

export const FunctionConstructor = FUNCTION({

  NativeCode($, parameters, source, name) {

    $.Primitive = FUNCTION(parameters, source, name)

      // to be referred as prototype by each object that newly constructed with this function
    $.Primitive.Prototype = OBJECT(ROOT, { Constructor: $ });

  },

  Prototype: FUNCTION_PROTOTYPE,

});

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
  const code = Fn.Primitive.Code;
  let index = 0, op = code[index], len = code.length;
  while (index < len && !context.Exit) {
    op.apply(context);
    op = code[index++];
  }
  Context = context.Next;

  // to provide context.Result outside
  return context.Result;
}
