function StringConstructor($, chars) {
  $.Value = STR(chars);
}


// used in string operations (concat, slice) etc.
const STR = (S) => struct.Variable({Type: TYPE_STRING, Value: S });

const STR_TRUE= STR('true')
const STR_FALSE= STR('false')
// EMPTY STRING VALUE
const EMPTY_STRING = struct.Variable({ Type: TYPE_STRING, Value: 0 });

function TO_STRING (V) {
  switch (V.Type) {
    case TYPE_OBJECT:
    return TO_OBJECT(VAL(V)).ToString()
    case TYPE_STRING:
    return V
    case TYPE_BOOLEAN:
    return V === FALSE ? STR_FALSE : STR_TRUE
  }
  return STR(``+N);
}
