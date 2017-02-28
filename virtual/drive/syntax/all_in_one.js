/**
 * This file contains subset of JS syntax that is minimal, but enough.
 *
 * By the way, This is block comment.
 */

import ExternalDefault from './OtherModuleFile.js';
import { ExternalNamed as Something, ExternalNamed2 } from 'ModulePackageIndex';

// inline comment
let someUndefinedLocalVariable /* = undefined */,
 otherVariableInitalizedBy4 = 4;

const STRING = `string ${interpolation} 123`;

// new operator
const array2 = new Array(5);

const ARRAY = [
  STRING,
  false,
  ()=>1
];

const OBJECT = {
  object,

  array : [1, 2, 3, 4],

  myString: 'Hello world!',

  myFunc: function () {
      return this.myString;
  }
};

// export arrow function defined as const
export const ARROW_FUNCTION = (a, b) => (a + b);

export function NamedFunction(parameter1, parameter2 = 'defaultValue') {

  // Conditional
  if (someConditionExpression) {

    thenStatementsHere(CONSTANT_123);

  } else {

    otherwise(ARROW_FUNCTION);
  }

  let count = 100;
  while (count--) {

    doIteration();
  }

  const array = [1, 2, 3, 4];
  for (let i = 0; i < array.length; i++) {
    array[i];
  }

  for (let variable in object) {
    if (object.hasOwnProperty(variable)) {

    }
  }

  for (let variable of iterable) {

  }

  return result > 0 ? 123 : '321';
}

export default class TheClass {

  static factory(opts) {

    return new BaseCar(opts);
  }

  constructor(opts) {

    Object.assign(this, opts);

    Object.defineProperty(this, '_id', { value:COUNT++ });

    this.name = helper.call(this, this._id);
  }

  workingWithArray(param, param2, ...rest) {

    let myArray = ['Hello', 45, true];

    myArray[3] = [ 'my other key', myArray[1] ];

    for (let item of rest) {

      this.method2(item, param);
    }

    return rest
        .forEach(e => doSomethingWith(e))
        .filter((e)=>(e > 0))
        .map((e)=>(2 * e))
        .reduce((r, e)=>{r.push(e); return r;}, []);
  }

  workingWithObject(item = {}, param) {
    let myObj = {
    };

    myObj.array = [ 'my other key',
     this.name,
     myObj.myKey,
     myObj['myThirdKey']
    ];

    return true;
  }
}

// define function
function findMax(param1, param2, ...rest) {

    let result = null;

    try {

        // while: iteration flow;
        while ( !a.isEmpty() ) {
            let b = 2;
            // if-else conditional flow
            if (a) {

                // variable assignment
                result = a * 3 + 2 + Math.random();

                break;

            } else {

                // invoke function
                return findMax(fnBad);

            }
        }

    } catch (ex) {

        console.error(ex);

        result = -0.2;

    } finally {

        good();

        result = result * 2;
    }

    return p1 === 5 ? result : p2;
}
