import { log } from '../utils/fn.js';

let lastId = 1;
/**
 * An Identity is something unique and can be distinguished from others.
 */
export default class Identity {

  static nextId = () => lastId++;

  constructor() {

    Object.defineProperty(this, '_id', { value: Identity.nextId() });
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
}
