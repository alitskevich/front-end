import assert from 'assert';
import { device } from './Device.js';
const { alloc, read, write, sizeOf, equals } = device.os.memory;

describe('Device', function () {

  it('alloc/size', () => {

    const ref = alloc(2);

    assert.equal(sizeOf(ref), 2);
  });

  it('read/write', () => {

    const ref = alloc(2);
    write(ref, 2);

    assert.equal(read(ref), 2);
  });

  it('equals', () => {

    const ref1 = alloc(2);
    write(ref1, 2);

    const ref2 = alloc(2);
    write(ref2, 2);
    //
    assert(equals(ref1, ref2));
  });
});
