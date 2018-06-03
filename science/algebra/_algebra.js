const reflexivity = fn => a => fn(a,a) === true 
const symmetry = fn => (a,b) => fn(a, b) === fn(b, a)
const transitivity = fn => (a,b,c) => fn(a,b) && fn(b, c) === true ? fn(a, c) === true : undefined
const totality = fn => (a,b) => fn(a,b) || fn(b,a) === true 
const antisymmetry = (fn, eq) => (a,b) => fn(a,b) && fn(b,a) === true ? eq(a,b) : undefined
const reflexivity = fn => (a,b) => fn(a,a) === true 
const associativity = fn => (a,b,c) => fn(fn(a,b),c) === fn(a,fn(b,c))
const left_identity = key => fn => (a) => fn(a.constructor[key],a) === a
const right_identity = key =>fn => (a) => fn(a, a.constructor[key]) === a
const left_inverse = key =>fn => (a) => fn(inverse(a), a) === a.constructor[key]
const right_inverse = key =>fn => (a) => fn(a, inverse(a)) === a.constructor[key]
RULES={
  equals:[reflexivity, symmetry, transitivity],
  lte: [totality,antisymmetry,transitivity],
  compose: [associativity],
  cat_compose: [associativity, left_identity('ID'), right_identity('ID')],
  concat: [associativity],
  mono_concat: [associativity, left_identity('EMPTY'), right_identity('EMPTY')],
  invert: [left_inverse('EMPTY'), right_inverse('EMPTY')],

  // Distributivity: F.filter(x => f(x) && g(x), a) ≡ F.filter(g, F.filter(f, a))
  // Identity: F.filter(x => true, a) ≡ a
  // Annihilation: F.filter(x => false, a) ≡ F.filter(x => false, b)
  filter: [distributivity, Identity, Annihilation],
  // Identity: F.map(x => x, a) ≡ a
  // Composition: F.map(x => f(g(x)), a) ≡ F.map(f, F.map(g, a))
  map:[Identity, Composition],
  //   Identity: B.bimap(x => x, x => x, a) ≡ a
  // Composition: B.bimap(x => f(g(x)), x => h(i(x)), a) ≡ B.bimap(f, h, B.bimap(g, i, a))
  bimap:[Identity, Composition],
  //Identity: F.contramap(x => x, a) ≡ a
  // Composition: F.contramap(x => f(g(x)), a) ≡ F.contramap(g, F.contramap(f, a))
  contramap:[Identity, Composition],
  // Identity: P.promap(x => x, x => x, a) ≡ a
  //Composition: P.promap(x => f(g(x)), x => h(i(x)), a) ≡ P.promap(g, h, P.promap(f, i, a))
  promap:[Identity, Composition],
  //Composition:A.ap(A.ap(A.map(f => g => x => f(g(x)), a), u), v) ≡ A.ap(a, A.ap(u, v))
  ap:[ Composition],
  //   Identity: A.ap(A.of(x => x), v) ≡ v
  // Homomorphism: A.ap(A.of(f), A.of(x)) ≡ A.of(f(x))
  // Interchange: A.ap(u, A.of(y)) ≡ A.ap(A.of(f => f(y)), u)
  clone:[Identity, Homomorphism, Interchange],
  //   Associativity: A.alt(A.alt(a, b), c) ≡ A.alt(a, A.alt(b, c))
  // Distributivity: A.map(f, A.alt(a, b)) ≡ A.alt(A.map(f, a), A.map(f, b))
  alt:[]
}

/**
 * 
 * 
 */
const ID = (X) => x=>x
const EMPTY = (X) => x=>false
// of: <a>(a) => T<a>
const clone = (X, x) => new X.constructor(x)
const equals = (X, Y) => X.val === Y.val 
const invert = (X) => clone(X, !X.val) 
const lte = (X, Y) => X.val < Y.val 
const compose = (X, X2) => clone(X, x => X.val(x2.val(x)) ) 
const cat_compose = (X, X2) => clone(X, x => X.val(x2.val(x)) ) 
const concat = (X, y) => clone(X, X.val + y ) 
const mono_concat = (X, y) => clone(X, X.val + y ) 
const fold = (X, defValue ) => xx2Y => xx2Y(X.val, defValue)
const chain = (X, x2Y ) => x2Y( X.val )

const map = (X, x2x)=> clone(X, x2x(X.val)) 
// A.map = (f, u) => A.bimap(x => x, f, u)
const bimap = (X, x2xL, x2xR )=> map(X, X.isLeft ? x2xL : x2xR )
//A.map = (f, u) => A.promap(x => x, f, u)

// functor.val is a function 
// ap: <a, b>(T<a => b>, T<a>) => T<b>
// A.map = (f, u) => A.ap(A.of(f), u)
const ap = (X, functor) => map(functor, fn => fn(X.val))

const algebra = {
  Identity: [ equals ],
  Semigroupoid: [compose],
  Category: [cat_compose],
  Ord: [ lte ],
  Semigroup: [ concat ],
  Monoid: [ mono_concat ],
  Group: [ ...Monoid, invert ],
  Filterable: [ filter ],
  Foldable: [ fold ],
  Chain: [ chain ],

  Functor: [ map ],
  Bifunctor: [ bimap ],
  Contravariant: [ contramap ],
  Profunctor: [ promap ],

  Apply: [ ...Functor, ap ],
  Applicative: [ ...Apply, clone ],
  Alt:[...Functor, alt],
  Plus: [...Alt, plus],
  Alternative:[],
  Monad: [ equals, chain, map, ap, clone ]
}

export const applyAlgebra = (T, name) => {
  Object.assign(T.prototype, algebra[name])
}