import { sigmoid, multiplyVectors, incProperties } from './math.js';

/**
 * The Perceptron.
 */
export class Perceptron {

  constructor(config) {

    Object.assign(this, config);
  }

  isValidInput(input) {

    for (let key in this.edges) {
      if (!input.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  apply(input) {

    this.output = sigmoid( multiplyVectors(this.edges, input));

    return this.output;
  }

  get derivation() {

    const s = this.output;

    return s == null ? null : s * ( 1 - s );
  }

  incEdges(delta) {

    incProperties(this.edges, delta);
  }

  toString() {

    return this.name + ': ' + Object.keys(this.edges)
      .map(key=> `${key}=${this.edges[key] < 0 ? '' : ' '}${Math.round(this.edges[key] * 1000) / 1000}`)
      .join(',');
  }
}
