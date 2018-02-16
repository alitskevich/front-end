// Generator

function* gen() {

  yield 0;

  yield 1;

  yield 2;
}

export function demo(max) {

  const iterator = gen();

  return [ ...iterator ].forEach((e)=> Object.log(e));

}
