/**
 * There are JS data types:
 */

// undefined type of single `undefined` constant
const TYPE_UNDEFINED = 0x0
// logical type of  `true` and `false` constants
const TYPE_BOOLEAN = 0x1
// numeric for integers and floats
const TYPE_NUMBER = 0x2
// non-numeric of single `NaN` constant
const TYPE_NOT_A_NUMBER = 0x3
// textual type for strings
const TYPE_STRING = 0x4
// symbol
const TYPE_SYMBOL = 0x5
// JS object
const TYPE_OBJECT = 0x6
// JS function object
const TYPE_FUNCTION = 0x7

// type names:
const $$TYPEOF = NAMES => Ref => NAMES[Ref.Type] (['undefined','boolean','number', "number", "string", "symbol", "object", "function"])