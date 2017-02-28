import Uri from './uri.js';
import assert from 'assert';

describe('Uri', function () {

  var SAMPLE = 'post!http://user@example.com:80/path0/path1?id=some&num=5&bool=true#%7B%22a%22%3A1%7D';
  var URI = Uri.create(SAMPLE);
  var SAMPLES = [
    'post!http://user@example.com:80/path0/path1?id=some&num=5&bool=true#%7B%22a%22%3A1%7D'
  ];

  it('Serialize', function () {

    SAMPLES.forEach(s => assert.equal(`${Uri.create(s)}`, s));
  });

  it('Parse', function () {

    var uri = URI;

    assert.equal(uri.id, 'http://example.com/path0/path1');

    assert.equal(uri.type, 'http');
    assert.equal(uri.method, 'post');
    assert.equal(uri.index, '80');
    assert.equal(uri.target, 'example.com');

    assert.equal(uri.path[0], 'path0');
    assert.equal(uri.path[1], 'path1');

    assert.equal(uri.params['id'], 'some');
    assert.equal(uri.params['num'], 5);
    assert.equal(uri.params['bool'], true);

    assert.equal(uri.data['a'], 1);

  });

  it('modify', function () {

    var uri = Uri.create([URI, '?id=other', {
        params: {
            b: 2
        },
        data: {
            a: 2
        }
    }]);
    assert.equal(uri.params['id'], 'other');
    assert.equal(uri.params['b'], 2);
    assert.equal(uri.data['a'], 2);

  });

  it('withData', function () {

    var uri = Uri.create([URI, {
        data: {
            a: 3
        }
    }]);
    assert.equal(uri.data['a'], 3);
  });

});
