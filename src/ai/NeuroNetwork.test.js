
import { train } from './NeuroNetwork.demo.js';
import assert from 'assert';

describe('NeuroNetwork', () => {
  it('train', () => {
    const olsLimit = 0.001;
    const metrics = train({ olsLimit });
    assert(metrics.ols <= olsLimit, ' done ');
  });
});
