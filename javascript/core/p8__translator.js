import { FUNCTION } from '../operations/instantiation';
import { ASSIGN_VAR } from '../operations/variables';
const acorn = require("acorn")
const walk = require("acorn/dist/walk");
/**
 *
 * @see https://github.com/ternjs/acorn
 *
 * @param Source
 * @param ParamsNames
 * @returns {*}
 */
export function $$TRANSLATE(Source, ParamsNames) {

  var LocalVariables = [];
  let ExternalNames = [];
  let CompiledCode = [];

  var ast = acorn.parse(Source);

  walk.recursive(ast, {}, {
    VariableDeclarator(n) {
      const name = n.id.name;
      LocalVariables.push(name);
    },
    FunctionDeclaration(n, state, c) {
      const name = n.id.name;
      LocalVariables.push(name);
      const fn = FUNCTION({
        Name: name
      });
      translate(fn.Internal, n.body);
      Statements.push(() => ASSIGN_VAR(name, fn));
      c(n.body, state);
    },
    AssignmentExpression(n, state, c) {
      Statements.push(() => VAR_SET(n.id.name, fn));
      c(n.left, state);
    },
    MemberExpression(n, state, c) {
      console.log(n)
      //Statements.push(() => API.ASSIGN(name, fn));
      c(n.object, state);
    },
    CallExpression(n, state, c) {
      console.log(n)
      //Statements.push(() => API.ASSIGN(name, fn));
      c(n, state);
    }
  });

  return {LocalNames, ExternalNames, CompiledCode };
}

function compileTryCatch(Try, Catch, Finally) {

  const context = ApplyFunction(Try);

  // check for exception
  if (context.Exception) {
    const Exception = context.Exception;

    if (Fn.Catch) {
      context.Result = ApplyFunction(Fn.Catch, context.This, [ Exception ]);
    } else {
      Object.assign(Context.Top, { Exit: true, Exception });
    }
  }

  // Apply Final block if any
  if (Fn.Finally) {
    context.Result = ApplyFunction(Fn.Finally, context.This);
  }

}
