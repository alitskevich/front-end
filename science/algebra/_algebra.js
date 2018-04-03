const clone = (X, x) => new X.constructor(x)
const equals = (X, Y) => X.val === Y.val 
const append = (X, y) => clone(X, X.val + y ) 
const fold = (X, defValue ) => xx2X => xx2X(X.val, defValue)
const chain = (X, x2X ) => x2X( X.val )
const map = (X, x2x)=> clone(X, x2x(X.val)) 
const bimap = (X, x2xLeft, x2xRight )=> map(X, X.isLeft ? x2xLeft : x2xRight )
// functor.val is a function 
const ap = (X, functor) => map(functor, fn => fn(X.val))

const algebra = {
  Identity: [ equals ],
  Semigroup: [ append ],
  Foldable: [ fold ],
  Chain: [ chain ],
  Functor: [ map ],
  Bifunctor: [ bimap ],
  Apply: [ map, ap ],
  Applicative: [ map, ap, clone ],
  Monad: [ equals, chain, map, ap, clone ]
}

export const applyAlgebra = (T,name) => Object.assign(T.prototype, algebra[name])