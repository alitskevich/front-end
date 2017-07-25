import { EXECUTION_STACK, CurrentVariableScope } from './context.js';
import { $NewObject, $Object, SetProperty, PROTO_PROPERTY } from './object.js';
import { $Tuple, $Map, TYPE_CODES, $String, $undefined } from './_core.js';
import { ensureCodeIsTranslated } from '../core/Translator.js';

const { FUNCTION } = TYPE_CODES;

const NAME_ANONYMOUS = ('anonymous');
const KEY_CONSTRUCTOR = $String('Constructor');

export const FUNCTION_PROTOTYPE = $Object({

  Apply: ApplyFunction,

  Call: ($, This, ...Arguments) => ApplyFunction($, This, Arguments),

  Bind: ($, BoundToThis) => $Function({ ...$, BoundToThis })
});

export function $Function({
    Parameters = [],
    Code,
    Name = NAME_ANONYMOUS,
    BoundToThis,
    // to be parent for a new variable scope in Apply()
    LexicalScope = CurrentVariableScope(),
    // to be referred as prototype by each object that newly constructed with this function
    Prototype = $NewObject()
  }) {

  const $descr = $Map({ __Proto__: PROTO_PROPERTY });
  const $data = $Map({
    Name,
    Parameters,
    BoundToThis,
    Code,
    LexicalScope,
    Prototype
  });

  const $ = $Tuple(FUNCTION, $data, $descr, FUNCTION_PROTOTYPE);

  SetProperty(Prototype, KEY_CONSTRUCTOR, $);

  return $;
}

export function ApplyFunction(Context, Fn, This = $undefined, Arguments = []) {

  // lazy translate source code into binary executable code
  ensureCodeIsTranslated(Fn);

  // create a new execution context for this invocation
  // and push it into execution stack
  let context = Context.Push({
    Fn,
    This: Fn.BoundToThis || This,
    Arguments
  });

  // Evaluate binary code
  for (let index = 0, op = Fn.Body[index], len = Fn.Body.length;
        index < len && !context.Exit;
        op = Fn.Body[index++]) {

    op.apply(context);
  }

  Context.Pop();

  // to provide context.Result outside
  return context.Result;
}
