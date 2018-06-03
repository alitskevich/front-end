
let lastId = 1;

/**
 * An Entity is something that 
 * - is an Identity: unique and can be distinguished from others.
 * - bears a state, but has no specific behavior.
 */
export default class Entity extends Identity {

  constructor(initialState) {
    Object.defineProperty(this, '_id', { value: lastId++ });
    Object.defineProperty(this, 'state', { value: { ...initialState } });
  }

  isEquals(x) {

    return x && (x._id === this._id);
  }

  /**
   * Gets string representation of component.
   */
  toString() {

    return `${this.constructor.name}${this._id}`;
  }

  log(...args) {

    return log(this.toString(), ...args);
  }
  keys() {

    return Object.keys(this.state);
  }

  has(key) {

    return key in this.state;
  }

  get(key) {

    return this.state[key];
  }

  set(key, value) {

    return this.update({ [key]: value });
  }

  update(delta) {

    Object.assign(this.state, delta);

    return this;
  }

  valueOf() {

    return this.state;
  }

  map(f) {

    return this.constructor(f(this.valueOf()));
  }

  clone(delta) {

    return this.map(state => ({ ...state, ...delta }));
  }

}
