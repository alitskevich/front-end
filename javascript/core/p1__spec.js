/**
 * Internal JS specification structures:
 */
const struct = {
  // reference to any typed value
  Ref: $$STRUCT({
      // type code
      Type: `TYPE`,
      // address of value
      Value: `*`
  }),
  // object
  Object: $$STRUCT({
    // hash of key/prop_descriptor pairs that constitute object state
    Props: `HASH<string, struct.PropertyDescriptor>`,
    // flag to set if object is able to add new keys
    Extensible: `bool`,
    // reference to prototype object that used for chaining when lookup props by key if no own exists.
    Proto: `struct.Object`,
    // set of methods to access to the object instance. May be changed for objects like Proxy.
    Reflect: `struct.Reflect`,
    // May refer to specific class name
    ClassName: '*',
    // May refer to specific structures used for `exotic` objects like internal Function, Array, Number etc
    Exotic: '*'
  }),
  // to hold and resolve variables by name with chaining
  VariableScope: $$STRUCT({
    // to resolve Externals
    OuterScope: `struct.VariableScope`,
    // own variables: Params and Locals
    Vars: `HASH<string, struct.Variable>`
  }),
  // to hold variable ref
  Variable: $$STRUCT({
    Counter: `int`,
    Ref: `struct.Ref`
  }),
  // object property access
  PropertyDescriptor: $$STRUCT({
    // Value
    Value: `struct.Variable`,
    // for accessor property:
    Get: `CODE:(This, p) => p.Value`,
    Set: `CODE:(This, p, value) => (p.Value = value)`,
    // flags:
    Writable: `bool`,
    Enumerable: `bool`,
    Configurable: `bool`
  }),
  // There is internal 'primitive' functional element, not JS Function object.
  Code: $$STRUCT({ 
    // function name
    Name: `string`,
    // list of variables names: parameters, locals variables, external variables from outer scope
    ParamsNames, LocalsNames, OutersNames: `ARRAY<string>`,
    // array of compiled operations
    CompiledOperations: `*`,
    // source body string
    Body: `string`,
    // bound `this` to be used at invocation disregard passed outside
    BoundThis: `*`,
    // INSIGHT: initialized with current variable scope at creation
    // to be parent for a new variable scope at Apply()
    Closure: `struct.VariableScope`
  }),
  // item of call stack
  ExecutionContext: $$STRUCT({
    Scope: `struct.VariableScope`,
    Line: `int`,
    Error: `struct.Ref`,
    Result: `struct.Ref`,
    This: `struct.Ref`,
    Args: `[]struct.Ref`
  })
}
