import { incProperty, random, mean } from './math.js';
import { Perceptron } from './Perceptron.js';

export class NeuroNetwork {

  constructor(config) {

    this.h1 = new Perceptron({ name:'h1', edges:{
      E: random(),
      i1: random(),
      i2: random()
    } });

    this.h2 = new Perceptron({ name:'h2', edges:{
      E: random(),
      i1: random(),
      i2: random()
    } });

    this.xor = new Perceptron({ name:'xor', edges:{
      E: random(),
      h1: random(),
      h2: random()
    } });
  }

  apply(i1, i2) {

    const input = { i1, i2, E: 1 };

    const h1 = this.h1.apply(input);
    const h2 = this.h2.apply(input);

    return this.xor.apply({ h1, h2, E: 1 });
  }

  train(examples, opts = {}) {

    const { olsLimit = 0.001, stepLimit = 100 } = opts;
    let step = 0, ols = null;

    for (; step < stepLimit && (ols === null || ols >= olsLimit); step++) {

        const deltas = { xor: {}, h1:{}, h2: {} };
        let errors = [];

        examples.forEach(({ input, output }) => {

          this.apply(input.i1, input.i2);

          const error = this.xor.output - output.xor;
          const delta = -error * this.xor.derivation;
          incProperty(deltas.xor, 'E', delta );
          incProperty(deltas.xor, 'h1', delta * this.h1.output);
          incProperty(deltas.xor, 'h2', delta * this.h2.output);
          errors.push(error);

          const error_h1 = this.xor.edges.h1 * error;
          const delta_h1 = -error_h1 * this.h1.derivation;
          incProperty(deltas.h1, 'E', delta_h1 );
          incProperty(deltas.h1, 'i1', delta_h1 * input.i1);
          incProperty(deltas.h1, 'i2', delta_h1 * input.i2);
          errors.push(error_h1);

          const error_h2 = this.xor.edges.h2 * error;
          const delta_h2 = -error_h2 * this.h2.derivation;
          incProperty(deltas.h2, 'E', delta_h2 );
          incProperty(deltas.h2, 'i1', delta_h2 * input.i1);
          incProperty(deltas.h2, 'i2', delta_h2 * input.i2);
          errors.push(error_h2);

        });

        ols = mean(errors.map(e=>e * e));
        Object.keys(deltas).forEach(name => this[name].incEdges(deltas[name]));
    }

    return { ols, steps: step };
  }

  toString() {

    return [this.h1, this.h2, this.xor]
      .map((node, index) => (index + ': ' + node))
      .join('\n');
  }

}
