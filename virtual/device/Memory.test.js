import assert from 'assert';
import Memory from './Memory.js';

const { read, write, readBytes, writeBytes } = (new Memory());

describe('Memory', function () {

  it('read/write', () => {

    write(2, 2);

    assert.equal(read(2), 2);

    write(3, 3, 3);
    write(2, 3);

    assert.equal(read(2), read(3, 3));
  });

  it('read/write bytes', () => {

    writeBytes(2, [2, 5]);

    assert.equal(read(2), 2);
    assert.equal(read(3), 5);
    assert.equal(readBytes(2, 2)[1], 5);
  });

});
