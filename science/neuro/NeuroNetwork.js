import { incProperty, mean } from './math.js';
import { Perceptron } from './Perceptron.js';

export class NeuroNetwork {

  constructor(config) {

    Object.assign(this, config);
  }

  get nodes() {

    return this.nodes_ || [];
  }

  set nodes(nodes) {

    this.nodesHash = {};
    this.nodes_ = Object.keys(nodes)
      .map(name => ({ name, edges: nodes[name] }))
      .map(config => (this.nodesHash[config.name] = new Perceptron(config)));
  }

  getNode(key) {

    return this.nodesHash[key];
  }

  apply(input) {

    const results = { ...input, E: 1 };

    for (let layer; (layer = this.nodes.filter(n => (results[n.name] == null) && n.isValidInput(results))).length; ) {
      layer.forEach(n => results[n.name] = n.apply(results) );
    }

    return results;
  }

  train(examples, opts = {}) {

    const { olsLimit = 0.001, stepLimit = 10000 } = opts;
    let step = 0, ols = null;

    for (; step < stepLimit && (ols === null || ols >= olsLimit); step++) {

        this.nodes.forEach(node => node.deltas = {});
        let errors = [];

        examples.forEach(({ input, output }) => {

          const results = this.apply(input);

          this.nodes
            .filter(n => !!output[n.name])
            .forEach(n => {
              const error = n.output - output[n.name];
              errors.push(error);
              this.backPropagate(error, n, results);
            });
        });

        ols = mean(errors.map(e=>e * e));

        this.nodes.forEach(node => node.incEdges(node.deltas));
    }

    return { ols, steps: step };
  }

  backPropagate(error, node, results) {

    // calculate and apply delta
    const delta = -error * node.derivation;
    Object.keys(node.edges)
      .forEach(key => incProperty(node.deltas, key, delta * results[key]));

    // drill down into preceding nodes
    Object.keys(node.edges)
      .map(key => this.getNode(key))
      .filter(n => !!n)
      .forEach(n => this.backPropagate(node.edges[n.name] * error, n, results));
  }

  toString() {

    const r = [];
    this.nodes.forEach((node, index) => r.push(index + ': ' + node));
    return r.join('\n');
  }

}
