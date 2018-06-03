/* Either Monad */
export const Left = {
    ...Monad,
    chain: fnId,
    ap: fnId,
    leftMap: (X, fn) => Left(fn(X.val)),
    cata: (X, l, r) => l(X.val),
    bimap: (X, leftFn, rightFn) => X.leftMap(leftFn),
  
    right:(X) => nThrow('Illegal state. Cannot call right() on a Either.left'),
    left:(X) => X.val,
  
    equals: (X, other) => isFunction(other.cata) && other.cata(equals(X.val), falseFunction),
  };
  
  export const Right = {
  
    ...Monad,
  
    // ap: (X, eitherWithFn) => eitherWithFn.map((fn) => fn(X.val)),
    // chain: Chain.chain,
  
    leftMap: (X, fn) => X,
    cata: (X, l, r) => r(X.val),
    bimap: (X, l, r) => X.map(r),
  
    right:(X) => X.val,
    left:(X) => assert(false, 'Illegal state. Cannot call left() on a Either.right'),
  
    equals: (X, other) => isFunction(other.cata) && other.cata(falseFunction, equals(X.val)),
  };
  export const Either = {
    init: (X) => ({
      isRight: !X.isLeft
    })
  };