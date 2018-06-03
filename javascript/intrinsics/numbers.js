
// used in comparision, arithmetic operations
function TO_NUMBER (val) {
  // TBD
}

// number primitive. Does not allocate heap memory.
const NUMBER = (coef, exp = 0, neg=0) => {
  return struct.Variable({ Type: TYPE_NUMBER, Value: neg & 0x8000 | exp & 0x7FFF, coef})
}

// DENOTES SET OF ANYTHING, BUT NOT A NUMBER 
const NAN = struct.Variable({ Type: TYPE_NOT_A_NUMBER, Value: 0 });
// ZERO NUMBER VALUE
const ZERO = struct.Variable({ Type: TYPE_NUMBER, Value: 0 });


const NumberPrototype = {
  ...ObjectReflect,
  ToExponential: ($, fractionalDigits) => ValueOf($),
  ToFixed: ($, fractionalDigits) => ValueOf($),
  ToPrecision: ($, fractionalDigits) => ValueOf($),
}

const NumberConstructor = ($, x) => {
  $.Value = TO_NUMBER(x)
}

// arithimetic
const PLUS = (a, b) => a + b;
const MINUS = (a, b) => a - b;
const EQUAL = (a, b) => a === b