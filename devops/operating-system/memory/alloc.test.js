import { MAKE, RESIZE, SIZE, TYPE } from './alloc';

const { ALLOC, GET, SET } = require('./alloc.js');
import assert from 'assert'
import { NULL, TYPE_ANY, UNDEFINED } from './_const';

describe('ALLOC', () => {

  it('ALLOC/SIZE/TYPE', () => {

    const $ = ALLOC(TYPE_ANY, 3);

    assert.equal(SIZE($), 3);
    assert.equal(TYPE($), TYPE_ANY);
  });
  it('EMPTY SIZE', () => {

    const $ = ALLOC(TYPE_ANY, 0);

    assert.equal(SIZE($), 0);
    assert.equal(SIZE(UNDEFINED), 0);
    assert.equal(SIZE(NULL), 0);
  });

  it('GET/SET', () => {

    const $ = ALLOC(TYPE_ANY, 3);

    SET($, 0, 3)
    SET($, 1, 4)
    SET($, 2, 5)

    assert.equal(GET($, 0), 3);
    assert.equal(GET($, 1), 4);
    assert.equal(GET($, 2), 5);

    assert.equal(GET($, 3), -1);
  });

  it('RESIZE', () => {

    const $$ = MAKE(TYPE_ANY, ALLOC(TYPE_ANY, 0));
    const offset = 0;

    RESIZE($$, offset, 4);

    assert.equal(SIZE(GET($$, offset)), 4);

    SET(GET($$, offset), 3, 5)

    assert.equal(GET(GET($$, offset), 3), 5);
  });

  it('MAKE', () => {

    const $ = MAKE(TYPE_ANY, 1, 2, 3);

    SET($, 2, 5)

    assert.equal(GET($, 2), 5);
  });

});
