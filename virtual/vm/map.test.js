import { MAKE, RESIZE, SIZE, TYPE } from './alloc';

const { ALLOC, GET, SET } = require('./alloc.js');
import assert from 'assert'
import { TYPE_ANY, TYPE_MAP, UNDEFINED } from './_const';
import { MAP, MAP_GET, MAP_INDEX_OF_KEY, MAP_SET, MAP_SIZE } from './map';

describe('MAP', () => {

  it('ALLOC EMPTY', () => {

    const $ = MAP();

    assert.equal(MAP_SIZE($), 0);
    assert.equal(TYPE($), TYPE_MAP);
  });

  it('SIZE', () => {

    const $ = MAP();

    MAP_SET($, 'a', 3);

    assert.equal(MAP_SIZE($), 1);

  });

  it('INDEX', () => {

    const $ = MAP();
    assert.equal(MAP_INDEX_OF_KEY($, 'a'), -1);

    MAP_SET($, 'a', 3);

    assert.equal(MAP_INDEX_OF_KEY($, 'a'), 0);
    assert.equal(MAP_INDEX_OF_KEY($, 'b'), -1);
  });

  it('GET/SET', () => {

    const $ = MAP();

    assert.equal(MAP_GET($, 'a'), UNDEFINED);
    assert.equal(MAP_GET($, 'b'), UNDEFINED);

    MAP_SET($, 'b', 4);
    assert.equal(MAP_GET($, 'b'), 4);

  });


});
