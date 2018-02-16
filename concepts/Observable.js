import { assert, isFunction } from '../utils/fn.js';

let COUNTER = 0;

/**
 * Observable keeps all observers by itself 1-to-N.
 */
export default class Observable {

  constructor() {

    Object.defineProperty(this, '_observers', { value: new Map() });
  }

  addObserver(o, key = COUNTER++) {

    assert(isFunction(o), 'Observer is not a function');

    this._observers.set(key, o);

    return key;
  }

  observeOnce(o, key = COUNTER++) {

    return this.addObserver(key, (event)=>(this.removeObserver(key) && o(event)));
  }

  removeObserver(key) {

    this._observers.delete(key);
  }

  notify(event = {}) {

    this._observers.forEach(o=>o(event));
  }
}
