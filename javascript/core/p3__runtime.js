/**
 * There are several special global variables:
 */
// DENOTES FULL SET
const UNDEFINED = 0; //struct.Variable({ Type: TYPE_UNDEFINED, Value: 0 });
// DENOTES EMPTY SET 
const NULL = struct.Variable({ Type: TYPE_OBJECT, Value: 0 }); 
// DENOTES SET CONSISTS OF [ UNDEFINED, NULL, NAN, ZERO, EMPTY_STRING ]
const FALSE = struct.Variable({ Type: TYPE_BOOLEAN, Value: 0 });
// DENOTES SET OF ANYTHING, EXCEPT FALSE
const TRUE = struct.Variable({ Type: TYPE_BOOLEAN, Value: 1 });

/**
 * JS runtime:
 */
const $$CODE_MAKE = (Name, Params, Source, BoundThis) => {
  const {LocalNames, ParamsNames, ExternalNames, CompiledCode} = $$TRANSLATE(Source, Params)
  return struct.Code({
    Name,
    BoundThis,
    // INSIGHT: here and now keep current variable scope 
    // to be used as outer for new variable scopes at APPLY()
    Closure: OutersNames.length == 0 ? UNDEFINED : $$STACK_CURRENT().Scope,
    // translated 
    LocalNames, ParamsNames, ExternalNames, CompiledCode
  })
}

const $$VARS_MAKE = (Code, Args)=> {
  // create a new variable scope and initialize vars 
  // INSIGHT: It is a "hoisting"
  const Vars = $$HASH()
  for (let index = 0, len = Code.ParamsNames.length; index < len; index++) {
    let name = Code.ParamsNames[index]
    Vars[name] = struct.Variable({ Ref: (index < Args.length) ? Args[index] : UNDEFINED }) 
  }
  for (let index = 0, len = Code.LocalNames.length; index < len; index++) {
    let name = Code.LocalNames[index]
    Vars[name] = struct.Variable({ Ref: UNDEFINED })
  }
  return struct.VariableScope({
    // INSIGHT: here and now function closure became outer scope for this variable scope
    Outer: Code.Closure,
    Vars,
  })
}

// Apply a function with given target and arguments
function $$CODE_APPLY(Code, This, Args) {
  // create a new execution context
  const Ctx = struct.ExecutionContext({ 
    Error: UNDEFINED,
    Return: UNDEFINED,
    Line: 0,
    This,
    Scope: $$VARS_MAKE(Code, Args),
  })

  $$STACK_PUSH(Ctx)
  // evaluate code
  for (let Length = Code.CompiledOperations.length; Ctx.Line >=0 && Ctx.Line < Length; Ctx.Line++) {
    Code.CompiledOperations[Ctx.Line]()
  }
  // pop stack and return result
  return $$STACK_POP()
}

// to be used from JS code to stop evaluation with result
function $$RETURN(Result = 0) { 
  const Ctx  = $$STACK_CURRENT()
  Ctx.Result = Result
  Ctx.Line = -1
}

// to be used from JS code to stop evaluation with error
function $$THROW(Err = 0) {
  const Ctx  = $$STACK_CURRENT()
  Ctx.Error = Err
  Ctx.Line = -2
}

function $$ASSERT(F, Err) {
  if (F) {
    $$THROW(Err)
  }
}

// look up variable by name
function $$VAR_LOOKUP(name) {
  // INSIGHT: here we're looking scopes chain for a variable by its name
  for (let scope = $$STACK_CURRENT().Scope; scope != 0; scope = scope.OuterScope ) {
    if (name in scope.Vars) {
      return scope.Vars[name]
    }
  }
  $$THROW(`[ReferenceError]: Variable is not defined: ${name}`);
}