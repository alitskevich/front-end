/**
 * There are JS data types:
 */

// undefined type of single `undefined` constant
const TYPE_UNDEFINED = 0x0
// logical type of  `true` and `false` constants
const TYPE_BOOLEAN = 0x1<<24
// numeric for integers and floats
const TYPE_NUMBER = 0x2<<24
// non-numeric of single `NaN` constant
const TYPE_NOT_A_NUMBER = 0x3<<24
// textual type for strings
const TYPE_STRING = 0x4<<24
// symbol
const TYPE_SYMBOL = 0x5<<24
// JS object
const TYPE_OBJECT = 0x6<<24
// JS function object
const TYPE_FUNCTION = 0x7<<24

// type names:
const $$TYPEOF = NAMES => Ref => NAMES[Ref.Type>>24] (['undefined','boolean','number', "number", "string", "symbol", "object", "function"])