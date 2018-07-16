// Object
const TO_OBJECT = (Ref) => {
  if (Ref === UNDEFINED || Ref === NULL) {
    return $$THROW(`TypeError: Cannot convert undefined or null to object`);
  }
  // from primitives
  switch (Ref.Type) {
    case TYPE_STRING:
      return StringConstructor.Reflect.Construct(StringConstructor, Ref)
    case TYPE_SYMBOL:
      return SymbolConstructor.Reflect.Construct(SymbolConstructor, Ref)
    case TYPE_NUMBER, TYPE_NOT_A_NUMBER:
      return NumberConstructor.Reflect.Construct(NumberConstructor, Ref)
  } 
  return Ref
}

// Properties access
const PROP_GET = (Ref, key) => {
  $$ASSERT(Ref !== UNDEFINED && Ref !== NULL, `TypeError: Cannot read property '${key}' of ${TO_STRING(Ref)}`)
  return TO_OBJECT(Ref).Reflect.Get(Ref, key);
}
const PROP_SET = (Ref, key, value) => {
  $$ASSERT(Ref !== UNDEFINED && Ref !== NULL, `TypeError:Cannot set property '${key}' of ${TO_STRING(Ref)}`)
  return TO_OBJECT(Ref).Reflect.Set(Ref, key, value)
}
const PROP_DEL = (Ref, key) => {
  $$ASSERT(Ref !== UNDEFINED && Ref !== NULL, `TypeError:Cannot delete property '${key}' of ${TO_STRING(Ref)}`)
  TO_OBJECT(Ref).Reflect.DeleteProperty(Refobj, key)
}

// Functions
const APPLY_FUNCTION = (Ref, This, Arguments) => TO_OBJECT(Ref).Reflect.Apply(Ref, This, Arguments)
const APPLY_METHOD = (This, Name, ...Args) => APPLY_FUNCTION(GET_PROP(This, Name), This, Args)
const NEW = (Ref, ...args) => TO_OBJECT(Ref).Reflect.Construct(Ref, args);

// Booleans

// used in conditional clauses, logical operations
function TO_BOOLEAN(Ref) {
  return Ref.Value === 0x0;
}

// arithimetic
// used in comparision, arithmetic operations
function TO_NUMBER (val) {
  // TBD
}
// number primitive. Does not allocate heap memory.
const NUMBER = (coef, exp = 0, neg=0) => {
  return struct.Variable({ Type: TYPE_NUMBER, Value: [ neg & 0x8000 | exp & 0x7FFF, coef ]})
}
const PLUS = (a, b) => a + b;
const MINUS = (a, b) => a - b;

// Strings

const STR_TRUE= STR('true')
const STR_FALSE= STR('false')
// used in string operations (concat, slice) etc.
const STR = (S) => struct.Variable({Type: TYPE_STRING, Value: S });

function TO_STRING (Ref) {
  switch (Ref.Type) {
    case TYPE_OBJECT, TYPE_NUMBER, TYPE_SYMBOL:
      return APPLY_METHOD(Ref, 'ToString')
    case TYPE_STRING:
      return Ref
    case TYPE_BOOLEAN:
      return Ref.Value === FALSE ? STR_FALSE : STR_TRUE
  }
  return STR(``+N);
}

function TO_PRIMITIVE(Ref) {
  return Ref.Type === TYPE_OBJECT ? V.Value.Exotic : Ref;
}
/**
 * Comparisions
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness
 * 
 */
function LOOSE_EQUALS(A, B) {
  if (A === UNDEFINED || A === NULL) {
    return B === UNDEFINED || B === NULL
  }
  if (A.Type === B.Type) {
    return STRICT_EQUALS (A, B)
  }
  switch (A.Type) {
    case TYPE_OBJECT:
      A = TO_PRIMITIVE(A)
    case TYPE_STRING:
      A = B.Type===TYPE_STRING ? A : TO_NUMBER(A)
    case TYPE_BOOLEAN:
      A = B.Type===TYPE_BOOLEAN ? A : TO_NUMBER(A)
  }
  // mirror for B
  switch (B.Type) {
    case TYPE_OBJECT:
      B = TO_PRIMITIVE(B)
      case TYPE_STRING:
      B = A.Type === TYPE_STRING ? B : TO_NUMBER(B)
    case TYPE_BOOLEAN:
      B = A.Type === TYPE_BOOLEAN ? A : TO_NUMBER(B)
  }
  return STRICT_EQUALS (A, B);
}

function STRICT_EQUALS (A, B) {
  if (A.Type !== B.Type) {
    return FALSE
  }
  if (A === UNDEFINED) {
    return B === UNDEFINED
  }
  if (A === NULL) {
    return B === NULL
  }
  if (A === NOT_A_NUMBER) {
    return FALSE
  }
  if (A.Type === TYPE_NUMBER) {
    return A === B /*numeric*/
  }
  return A.Value === B.Value; //
}