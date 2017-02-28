import assert from 'assert';
import Promise from './Promise.js';

describe('Promise', ()=>{

  it('resolve', ()=> {

    Promise.resolve(1).then( r => {
      assert.equal(r, 1, 'equals 1');
    });
  });

  it('then-sync', ()=> {

    new Promise( rs => rs(1))
    .then( r => {
      assert.equal(r, 1, 'equals 1');
    });

  });

  it('then', (done)=> {

    new Promise( rs => setTimeout(rs(1), 10))
    .then( r => {
      assert.equal(r, 1, 'equals 1');
      done();
    });

  });

  it('then-then', (done)=> {

    new Promise(rs => setTimeout(rs(1), 10))
    .then( r => {
      assert.equal(r, 1, 'equals 1');
      return r + 1;
    })
    .then( r => {
      assert.equal(r, 2, 'equals 2');
      done();
    });

  });

});
