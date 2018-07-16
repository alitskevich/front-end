// symbol primitive.
const Symbol = (key) => struct.Ref(TYPE_SYMBOL, TO_STRING(key))