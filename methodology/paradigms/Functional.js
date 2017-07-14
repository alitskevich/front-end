/**
 * Everything is functions. Function as a first-class citizen.
 *
 */
export const FunctionalParadigm = {

  purity(x, y) {

    // 1. deterministic = same result for same arguments
    // 2. no side-effects = no assigments into external context

    return x + y;
  },

  composition(a, b) {

    return (x)=> a(b(x));
  },

  carrying(fn, a) {

    return (x) => fn(a, x);
  }
};
