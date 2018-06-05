/**
 * There are several global constants:
 */
// DENOTES FULL SET
const UNDEFINED = struct.Ref({ Type: TYPE_UNDEFINED, Value: 0x0 });
// DENOTES EMPTY SET 
const NULL = struct.Ref({ Type: TYPE_OBJECT, Value: 0x0 }); 
// EMPTY STRING VALUE
const EMPTY_STRING = struct.Ref({ Type: TYPE_STRING, Value: 0x0 });
// DENOTES SET OF ANYTHING, BUT NOT A NUMBER 
const NAN = struct.Ref({ Type: TYPE_NOT_A_NUMBER, Value: 0x0 });
// ZERO NUMBER VALUE
const ZERO = struct.Ref({ Type: TYPE_NUMBER, Value: 0x0 });
// DENOTES SET CONSISTS OF [ UNDEFINED, NULL, NAN, ZERO, EMPTY_STRING ]
const FALSE = struct.Ref({ Type: TYPE_BOOLEAN, Value: 0x0 });
// DENOTES SET OF ANYTHING, EXCEPT FALSE
const TRUE = struct.Ref({ Type: TYPE_BOOLEAN, Value: 0x1 });
