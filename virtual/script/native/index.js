export { $Function, FUNCTION_PROTOTYPE } from './function.js';
export { $Object, Set, Get } from './object.js';
export { $String, $Tuple, $undefined, $Map } from './_core.js';

import { $String } from './_core.js';

export const KEY_PROTOTYPE = $String('Prototype');

export { ObjectConstructor } from './types/Object.js';

/**
 * Everything you need to run script.
 * That is only what your code be translated into.
 */

 export function New(Constructor, ...Arguments) {

   return Constructor.New(Constructor, ...Arguments);
 }

 export {

   // Functions
  FunctionCreate, ApplyFunction,

  // Objects
  NewObject, ObjectCreate,

  DefineProperty, GetProperty, SetProperty, ObjectAssign,

  // Variables
  AssignVar, GetVar

} from './native';
