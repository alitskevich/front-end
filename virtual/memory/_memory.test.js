const { M_ALLOC, M_CAP, M_GET, M_SET, M_COPY, M_EQUALS } = require('./_memory.js');
import assert from 'assert'

describe('MEMORY', () => {

  it('ALLOC/CAP', () => {

    const $ = M_ALLOC(3);

    assert.equal(M_CAP($), 3);
  });

  it('GET/SET', () => {

    const $ = M_ALLOC(3);

    M_SET($, 3)
    M_SET($ + 1, 4)
    M_SET($ + 2, 5)

    assert.equal(M_GET($), 3);
    assert.equal(M_GET($ + 1), 4);
    assert.equal(M_GET($ + 2), 5);
  });

  it('COPY/EQUALS', () => {

    const $1 = M_ALLOC(3);
    const $2 = M_ALLOC(3);

    M_SET($1 + 0, 3)
    M_SET($1 + 1, 4)
    M_SET($1 + 2, 5)

    M_COPY(M_CAP($1), $1, $2)

    assert(M_EQUALS(M_CAP($1), $1, $2));
  });

});
