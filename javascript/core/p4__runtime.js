/**
 * JS runtime:
 */
// execution stack simulation:
const [$$STACK_PUSH, $$STACK_POP] = (STACK => [e=>STACK.unshift(e), ()=>STACK.shift()])([])

// make an executable code block
const $$CODE = (Name, ParamsNames, Source, BoundThis) => {
  const {LocalNames, ExternalNames, CompiledCode} = $$TRANSLATE(Source, ParamsNames)
  return struct.Code({
    Name,
    BoundThis,
    // INSIGHT: here and now keep current variable scope 
    // to be used at APPLY() as an outer scope
    Closure: OutersNames.length == 0 ? UNDEFINED : STACK[0].Scope,
    // translated 
    LocalNames, ParamsNames, ExternalNames, CompiledCode
  })
}

const $$VAR_SCOPE = (Code, Args)=> {
  // create a new variable scope and initialize vars 
  // INSIGHT: It is a "hoisting"
  const Vars = {}
  for (let index = 0, len = Code.ParamsNames.length; index < len; index++) {
    let name = Code.ParamsNames[index]
    Vars[name] = struct.Variable({ Ref: (index < Args.length) ? Args[index] : UNDEFINED }) 
  }
  for (let index = 0x0, len = Code.LocalNames.length; index < len; index++) {
    let name = Code.LocalNames[index]
    Vars[name] = struct.Variable({ Ref: UNDEFINED })
  }
  return struct.VariableScope({
    // INSIGHT: here and now function closure became outer scope for current variable scope
    Outer: Code.Closure,
    Vars,
  })
}

// Apply a function with given target and arguments
function $$APPLY(Code, This = UNDEFINED, Args = []) {
  // create a new execution context
  let Ctx = struct.ExecutionContext({ 
    Error: UNDEFINED,
    Return: UNDEFINED,
    Line: 0x0,
    This,
    Args,
    Scope: $$VAR_SCOPE(Code, Args),
  })

  $$STACK_PUSH(Ctx)
  
  for (let Length = Code.CompiledOperations.length; Ctx.Line >= 0x0 && Ctx.Line < Length; Ctx.Line++) {
    Code.CompiledOperations[Ctx.Line]()
  }

  Ctx = $$STACK_POP()

  if (Ctx.Error) {
    if (Code.Catch) {
      return $$APPLY(Code.Catch, This, [Ctx.Error])
    } else {
      $$THROW(Ctx.Error)
    }
  }

  if (Code.Finally) {
    $$APPLY(Code.Finally, This, [])
  }
  
  return Ctx.Result
}

// to be used from JS code to stop evaluation with result
function $$RETURN(Result = UNDEFINED) { 
  STACK[0].Result = Result
  STACK[0].Line = -0x1
}

// to be used from JS code to stop evaluation with error
function $$THROW(Err = `Error: Unknown error`) {
  STACK[0].Error = Err
  STACK[0].Line = -0x1
}

function $$ASSERT(F, Err) {
  if (!F) {
    $$THROW(Err)
  }
}

// current arguments
function $$ARGS() {
  return $STACK[0].Args
}

// look up variable by name
function $$VAR_LOOKUP(name) {
  // INSIGHT: here we're looking scopes chain for a variable by its name
  for (let scope = STACK[0].Scope; scope != UNDEFINED; scope = scope.OuterScope ) {
    if (name in scope.Vars) {
      return scope.Vars[name]
    }
  }
  $$THROW(`ReferenceError: Variable is not defined: ${name}`);
}

// Variables access
const VAR_GET = (name) => $$VAR_LOOKUP(name).Ref
const VAR_SET = (name, Value) => { return $$VAR_LOOKUP(name).Ref = Value }
