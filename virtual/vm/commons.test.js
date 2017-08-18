import { MAKE, RESIZE, SIZE, TYPE } from './alloc';

const { ALLOC, GET, SET } = require('./alloc.js');
import assert from 'assert'
import { FALSE, TRUE, TYPE_ANY, TYPE_MAP, UNDEFINED } from './_const';
import { MAP, MAP_GET, MAP_SET, MAP_SIZE } from './map';
import { HASH, TRUTHY } from './commons';

describe('COMMONS', () => {

  it('TRUTHY', () => {

    const $ = MAP();

    assert.equal(TRUTHY($), TRUE);
    assert.equal(TRUTHY(UNDEFINED), FALSE);
  });

  it('HASH', () => {

    const $ = MAP(1,2,3,4);

    assert.equal(HASH($), -32);


  });


});
