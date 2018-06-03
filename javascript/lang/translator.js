import { FUNCTION } from '../operations/instantiation';
import { ASSIGN_VAR } from '../operations/variables';

const acorn = require("acorn")
const walk = require("acorn/dist/walk");

/**
 * parse source into AST
 * @param Source
 * @param Fn
 */
export function parse(Source) {
  return typeof Source === 'object' ? Source : acorn.parse(Source, {
    // collect ranges for each node
    // ranges: true,
    // collect comments in Esprima's format
    // onComment: comments,
    // collect token ranges
    // onToken: tokens
  });
}

/**
 *
 * @see https://github.com/ternjs/acorn
 *
 * @param Source
 * @param Fn
 * @returns {*}
 */
export function TRANSLATE(Source, ParamsNames) {

  var LocalVariables = [];
  let Parameters = [];
  let Statements = [];

  var ast = parse(Source);

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

      // Statements.push(() => API.ASSIGN(name, fn));
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

  const Code = () => {
    Statements.forEach(st => st.apply())
  }

  return Object.assign(Fn, { LocalVariables, Parameters, Code });
}

export function compileTryCatch(Try, Catch, Finally) {

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
