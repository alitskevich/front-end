import assert from 'assert';
import { Alloc } from './_core';

describe('_core', function () {

  it('Alloc', () => {

    const obj = Alloc(1, 2);

    assert.equal(obj, 1);
  });
});
