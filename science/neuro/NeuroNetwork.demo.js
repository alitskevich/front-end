import { random } from './math.js';
import { NeuroNetwork } from './NeuroNetwork.js';

export const examples = [
  { input: { i1:0, i2:0 }, output: { xor: 0 } },
  { input: { i1:1, i2:0 }, output: { xor: 1 } },
  { input: { i1:0, i2:1 }, output: { xor: 1 } },
  { input: { i1:1, i2:1 }, output: { xor: 0 } }
];

export const meta = {
  nodes: {
    h1:{
      E: random(),
      i1: random(),
      i2: random()
    },
    h2:{
      E: random(),
      i1: random(),
      i2: random()
    },
    xor:{
      E: random(),
      h1: random(),
      h2: random()
    }
  }
};

export function train(opts) {

  const nn = new NeuroNetwork(meta);

  console.log('NN-BEFORE:\n' + nn);

  const metrics = nn.train(examples, opts);

  // console.log('metrics:\n', metrics);
  console.log('NN-AFTER:\n' + nn);

  return metrics;
}
