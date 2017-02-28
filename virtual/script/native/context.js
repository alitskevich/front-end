import { $undefined, $Object, $Map, $String, GetValueByKey } from './_core.js';
import { fnThrow, assert } from './_core.js';
import { GetPrototypeOf, HasOwnProperty, GetProperty, SetProperty } from './object.js';

const KEY_SCOPE = $String('Scope');

export function GlobalContext(stack) {

  const OUT_OF_SCOPE = $Object({
    Get: (Var) => fnThrow(`variable '${Var}' is not defined`, ReferenceError),
    Assign: (Var, Value) => fnThrow(`variable '${Var}' is not defined`, ReferenceError)
  });

  const top = $Object({ Scope: OUT_OF_SCOPE });

  stack.push(top);

  function CurrentVariableScope() {

    return GetValueByKey(stack.top, KEY_SCOPE);
  }

  function GetVar(Id) {

    const scope = CurrentVariableScope();

    return GetProperty(scope, Id);
  }

  function AssignVar(Id, Value, scope = CurrentVariableScope()) {

    if (HasOwnProperty(scope, Id)) {

      SetProperty(scope, Id, Value);

    } else {

      AssignVar(Id, Value, GetPrototypeOf(scope));
    }
  }

  function DefineVar(Id, Value = $undefined, scope = CurrentVariableScope()) {

    assert(!HasOwnProperty(scope, Id), `variable '${Id}' is already defined`, ReferenceError);

    SetProperty(scope, Id, Value);
  }

  function Push({ Fn, This, Arguments }) {

    let Scope = CurrentVariableScope();

    if (Fn.Parameters.length + Fn.Variables.length) {
      // create a new variable scope exclosed by this function lexical scope
      Scope = $Object({}, Fn.LexicalScope);
      // define parameters and initialize them with arguments values in order of appearance
      Fn.Parameters.forEach((name, index) => DefineVar(name, Arguments[index], Scope));
      // define all variables BEFORE any execution, e.g. Hoisting
      Fn.Variables.forEach((name) => DefineVar(name, $undefined, Scope));
    }

    stack.push($Map({ Scope, Fn, This, Arguments }));
  }

  // execution context
  return {
    Push,
    Pop: () => stack.pop(),
    GetVar,
    AssignVar,
    DefineVar,
    CurrentVariableScope
  };
}
