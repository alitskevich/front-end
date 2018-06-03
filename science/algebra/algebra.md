# Algebra

## Definitions

`Algebra` is a set of values, a set of operators that it is closed under and some laws it must obey.

    A={ X={x}  , OPS={X->X} , RULE={r(OPS)} }

`value` is any JavaScript value, including any which have the structures defined below.

`equivalent` an obligation which ensure that the two values can be safely swapped out in a program. For example:

- Two lists are equivalent if they are equivalent at all indices.
- Two plain old JavaScript objects, interpreted as dictionaries, are equivalent when they are equivalent for all keys.
- Two promises are equivalent when they yield equivalent values.
- Two functions are equivalent if they yield equivalent outputs for equivalent inputs.


see https://github.com/fantasyland/fantasy-land