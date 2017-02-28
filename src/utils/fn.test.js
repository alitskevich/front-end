import assert from 'assert';
import { curry } from '../utils/fn.js';

describe('Curry', function () {

  it('sum', ()=>{
    const sum = (a, b) => a + b;
    const sum5 = curry(sum, 5);
    assert.equal(sum5(3), 8);
  });
});
