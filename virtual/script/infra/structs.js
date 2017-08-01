
/**
 * Structures
 */
export function struct(id, type, fields) {

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
   {$: MAKE(type, keys.map((o, key, index)=>defs[key]||0))}
  );
}


/**
 * Struct.
 */

struct(`Context`, TYPE_ANY, {
  Next: `Context`,
  Fn: `Function`,
  This: `Any`,
  Arguments:`[]Any`,
  VariableScope:`VariableScope`
});

struct(`VariableScope`, TYPE_ANY, {
  Data: `Map`,
  Parent: `VariableScope`
});

struct(`Object`, TYPE_OBJECT, {
  Meta: `Map`,
  Data: `Map`,
  Proto: `Object`,
  Primitive: `*`
});

struct(`PropertyDecriptor`, TYPE_ANY, {
  Getter: `Fn`,
  Setter: `Fn`,
  IsEnumerable: `bool`,
  IsConfigurable: `bool`
});

struct(`Function`, TYPE_FUNCTION, {
  Name: `String`,
  Parameters: `[]String`,
  Code:'*',
  // force `this` binding regardless passed at invocation
  BoundToThis: `Any`,
  // initialized with current scope at creation
  // to be parent for a new variable scope in Apply()
  LexicalScope: `VariableScope`,
  // prototype instance that used to create an object with `new F()`
  NewPrototype: `Object`
});
