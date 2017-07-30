import { UNDEFINED, NEW_MAP, MAP_HAS_KEY, MAP_GET, MAP_SET } from './_impl.js';
import { struct } from './struct.js';

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
export function GetVar(Id) {

  const scope = lookupScopeFor(Id);
  if (scope) {
    return MAP_GET(scope.Data, Id);
  }
}

// GetVar method
export function AssignVar(Id, Value) {

  const scope = lookupScopeFor(Id);
  if (scope) {
     MAP_SET(scope.Data, Id, Value);
  }
}

export function ExecuteFunction(Fn, This, Arguments) {

  let VariableScope = Context.VariableScope;

  if (Fn.parameters.length + Fn.localVariables.length) {
    const Data = NEW_MAP();
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
  for (let index = 0, op = Fn.Body[index], len = Fn.Body.length;
        index < len && !context.Exit;
        op = Fn.Body[index++]) {

    op.apply(context);
  }
  Context = context.Next;

  // to provide context.Result outside
  return context.Result;
}
