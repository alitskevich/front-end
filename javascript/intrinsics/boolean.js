
const BooleanPrototype = ObjectPrototype;

const BooleanConstructor = ($, V) => {
  $.Value = V.Value === 0 ? FALSE : TRUE
};

// used in conditional clauses, logical operations
function TO_BOOLEAN(V) {
  return V.Value === 0;
}
