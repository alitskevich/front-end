/**
 * The Generator object is returned by a generator function
 * and it conforms to both the iterable protocol and the iterator protocol.
 *
 * ```
 * function* gen() {
 *   yield 1;
 *   yield 2;
 *   yield 3;
 * }
 *
 *  var g = gen(); // "Generator { }"
 * ```
 */

function* gen() {
  yield 0;
  yield 1;
  yield 2;
}

export function demo(max) {

  const iterator = gen();

  return [ ...iterator ].forEach((e)=> Object.log(e));

}
