import { ALLOC, MAKE, GET, SET, SIZE, TYPE, RESIZE} from './infra/_alloc.js';

// ----------------------------------------------
// Object
// ----------------------------------------------

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

  const Meta = proto ? MAP({ __Proto__ : PROTO_PROPERTY}) : MAP();

  const Data = MAP(initials)

  return struct.Object({
    Meta,
    Data,
    Proto: proto,
    Primitive: UNDEFINED
  });
}

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
 * Object Constructor
 */
export const ObjectConstructor = struct.Object({

  Proto: FUNCTION_PROTOTYPE,

  Primitive: struct.Function({

    Name : 'Object',

    NewPrototype: ROOT,

    Code($, ...Arguments) {
      // no-op
    }

  }),

  Data: MAP({

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
  })
 });

// ----------------------------------------------
// Context
// ----------------------------------------------

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

// ----------------------------------------------
// Function
// ----------------------------------------------

/**
 * Function
 */
 const FUNCTION_PROTOTYPE = OBJECT(ROOT, {

   Apply: ($, This, Arguments) => FUNCTION_APPLY($.Primitive, This, Arguments),

   Call: ($, This, ...Arguments) => FUNCTION_APPLY($.Primitive, This, Arguments),

   Bind: ($, BoundToThis, ...Arguments) => NewFunction({ ...$, BoundToThis })
});

export const FunctionConstructor = struct.Object({

  Proto: FUNCTION_PROTOTYPE,

  Primitive: struct.Function({

    Code($, parameters, source, name) {

      $.Primitive = FUNCTION_STRUCT(parameters, source, name)

        // to be referred as prototype by each object that newly constructed with this function
      $.Primitive.NewPrototype = OBJECT(ROOT, { Constructor: $ });

    },

    NewPrototype: FUNCTION_PROTOTYPE
  }),
  Data: MAP(),
  Meta: MAP(),
});

export function FUNCTION_STRUCT(parameters, source, name, reciever) {

  const $ = struct.Function({
    Parameters: parameters || [],
    Name : name || '',
    BoundToThis: reciever,
    // to be parent for a new variable scope in Apply()
    LexicalScope: Context.variableScope
  });

  translate($, source);

  return $;
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

export function NEW(ctor, ...args) {

  const $ = OBJECT(ctor.Primitive.NewPrototype);

  FUNCTION_CALL(ctor, $, ...args)

  return $;
};
