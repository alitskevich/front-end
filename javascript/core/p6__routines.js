
// Object
function TO_OBJECT (V) {
  if (V === UNDEFINED || V === NULL) {
      return $$THROW(`TypeError:Cannot convert undefined or null to object`);
  }
  switch (TYP(V)) {
      case TYPE_OBJECT:
        return V
      case TYPE_STRING:
        return new String(V)
      case TYPE_NUMBER, TYPE_NOT_A_NUMBER:
        return new Number(V)
  } 
}

const OBJ_ACCESS = ($) => TO_OBJECT($).Reflect

const PROP_GET = ($, key) => {
  if ($ === UNDEFINED || $ === NULL) { 
    THROW(`TypeError:Cannot read property '${key}' of ${TO_STRING($)}`)
  } else {
    return OBJ_ACCESS($).Get($, key);
  }
}
const PROP_SET = ($, key, value) => {
  if ($ === UNDEFINED || $ === NULL) {
    THROW(`TypeError:Cannot set property '${key}' of ${TO_STRING($)}`)
  } else {
    return OBJ_ACCESS($).Set($, key, value)
  }
}
const PROP_DEL = ($, key) => OBJ_ACCESS($).DeleteProperty($obj, key)


// Functions

const APPLY_FUNCTION = ($, This, Arguments) => OBJ_ACCESS($).Apply($, This, Arguments)
const APPLY_METHOD = (This, Name, ...Args) => APPLY_FUNCTION(GET_PROP(This, Name), This, Args)
const NEW = ($, ...args) => OBJ_ACCESS($).Construct($, args);

// Booleans

// used in conditional clauses, logical operations
function TO_BOOLEAN(V) {
  return V.Value === 0;
}

// arithimetic
// used in comparision, arithmetic operations
function TO_NUMBER (val) {
  // TBD
}
// number primitive. Does not allocate heap memory.
const NUMBER = (coef, exp = 0, neg=0) => {
  return struct.Variable({ Type: TYPE_NUMBER, Value: neg & 0x8000 | exp & 0x7FFF, coef})
}
const PLUS = (a, b) => a + b;
const MINUS = (a, b) => a - b;
const EQUAL = (a, b) => a === b


// Strings

const STR_TRUE= STR('true')
const STR_FALSE= STR('false')
// used in string operations (concat, slice) etc.
const STR = (S) => struct.Variable({Type: TYPE_STRING, Value: S });

function TO_STRING (V) {
  switch (V.Type) {
    case TYPE_OBJECT:
      return APPLY_METHOD(V, 'ToString')
    case TYPE_STRING:
      return V
    case TYPE_BOOLEAN:
      return V === FALSE ? STR_FALSE : STR_TRUE
  }
  return STR(``+N);
}

function EQUALS2 (A, B) {
  switch (A.Type) {
    case TYPE_OBJECT:
      B = TO_OBJECT(B)
    case TYPE_STRING:
      B = TO_STRING(B)
    case TYPE_NUMBER:
      B = TO_NUMBER(B)
  }
  return EQUALS3 (A, B);
}

function EQUALS3 (A, B) {
  if (A.Type !== B.Type) {
    return FALSE
  }
  switch (A.Type) {
    case TYPE_OBJECT:
      return A===B
    case TYPE_STRING:
      return STR_EQUALS(A, B)
    case TYPE_NUMBER:
      return NUM_EQUALS(A, B)
  }
  return A===B;
}