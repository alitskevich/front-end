import Identity from './Identity.js';
/**
 * An Entity is an Identity that bears a state, but has no specific behavior.
 */
export default class Entity extends Identity {

  constructor(initialState) {

    super();

    Object.defineProperty(this, 'state', { value: { ...initialState } });
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
