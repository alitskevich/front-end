import { NEW_OBJECT } from './object.js';
import { struct } from './struct.js';

export function NewFunction({
    Parameters = [],
    Code,
    Name = '',
    BoundToThis
  }) {

  // lazy translate source code into binary executable code

  const $ = struct.Function({
    Parameters: [],
    Code,
    Name,
    BoundToThis,
    // to be parent for a new variable scope in Apply()
    LexicalScope: context.variableScope
  });

  // translate($);

  // to be referred as prototype by each object that newly constructed with this function
  $.Prototype = NEW_OBJECT({ Constructor: $ });

  return $;
}
