import { fnId } from '../utils/fn.js';
import Nil from './Nil.js';

/**
 * a Pattern class provides ability to construct tests on some cursor.
 */
export default class Pattern {

  static create(fn) {

    return new Pattern(narrowTest(fn));
  }

  constructor(fn = fnId) {

    this.fn = fn;
  }

  apply(x) {

    return this.fn(x);
  }

  map(fn) {

    return new Pattern(fn(this.fn));
  }

  and(_f2) {

    const f2 = narrowTest(_f2);

    return this.map(f => x => f2(f(x)));
  }

  or(_f2) {

    const f2 = narrowTest(_f2);

    return this.map(f => (x, t = f(x).someOrNull()) => t || f2(x));
  }

  maybe() {

    return this.map(f => x => f(x).someOrElse(x));
  }

  not() {

    return this.map(f => x => f(x).someOrNull() ? Nil : x );
  }

  next(_f2) {

    const f2 = narrowTest(_f2);

    return this.map(f => (x, t = f(x)) => f2( t.nextOrNil ));
  }

  mayNext(_f2) {

    const f2 = narrowTest(_f2);

    return this.map(f => (x, t = f(x)) => f2( t.nextOrNil ).someOrElse(t));
  }

  repeatNext(_f2, min, max) {

    const f2 = narrowTest(_f2);

    const tt = times(x => f2( x.nextOrNil ), min, max);

    return this.map(f => (x, t = f(x)) => t ? tt(t) : t);
  }

  separatedList(_f2, min, max) {

    const f2 = narrowTest(_f2);

    const tt = times((x, sep = f2( x.nextOrNil )) => this.fn(sep.nextOrNil), min, max);

    return this.map(f => (x, t = f(x)) => t ? tt(t) : Nil);
  }
}

export function narrowTest(f) {

  if (typeof f === 'function') {
    return f;
  }

  return Array.isArray(f) ? x=>x.isAny(...f) : x=>x.is(f);
}

export function times(f, min = 0, max = 1000) {

  return x0 => {

    let count = 0;
    let x = x0;

    for (; !x.isNil && count < max; count++) {
      let xx = f(x);
      if (!xx.isNil) {
        x = xx;
      } else {
        return (count >= min) ? x : Nil;
      }
    }

    return x;
  };
}
