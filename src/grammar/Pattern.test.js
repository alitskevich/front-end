import assert from 'assert';
import Pattern from './Pattern.js';
import Lexon from './Lexon.js';
import Nil from './Nil.js';

describe('Pattern', function () {

  it('basic', ()=> {

    const pattern = Pattern.create(e => e.flag ? e : null);

    const e = { flag: true };

    assert.equal(pattern.apply(e), e);
  });

  it('and', ()=> {

    const pattern = Pattern.create('f1').and('f2');

    const e = Lexon.create({ tags: { f1: 1, f2: 0 } });

    assert.equal(pattern.apply(e), Nil);

    const e2 = e.clone({ tags:{ f2:1 } });

    assert.equal(pattern.apply(e2), e2);
   });

  it('not', ()=> {

    const pattern = Pattern.create('f3').not();

    const e = Lexon.create({ tags: { f1: 1, f2: 1 } });

    assert.equal(pattern.apply(e), e);
    assert.equal(pattern.apply(e.clone({ tags:{ f3:1 } })), Nil);
  });

  it('next', ()=> {

    const pattern = Pattern.create('f1').next('f2');

    const parent = Lexon.create({ tags:{} });
    const e1 = Lexon.create({ text:'e1', tags: { f1: 1 }, parent });
    const e2 = Lexon.create({ text:'e2', tags: { f2: 1 }, parent });

    assert.equal(pattern.apply(e1).text, e1.next.text);

    e2.tags = { f2: 0 };
    assert.equal(pattern.apply(e1), Nil);

  });

  it('mayNext', ()=> {

    const pattern = Pattern.create('f1').mayNext('f2');

    const parent = Lexon.create({ tags:{} });
    const e1 = Lexon.create({ text:'e1', tags: { f1: 1 }, parent });
    const e2 = Lexon.create({ text:'e2', tags: { f2: 1 }, parent });

    assert.equal(pattern.apply(e1).text, e2.text);

    e2.tags = { f2: 0 };
    assert.equal(pattern.apply(e1).text, e1.text);

  });

  xit('repeatNext', ()=> {

    const pattern = Pattern.create('f1').repeatNext('f2');

    const parent = Lexon.create({ tags:{} });
    const e1 = Lexon.create({ tags: { f1: 1 }, parent });
    const e20 = Lexon.create({ tags: { f2: 1 }, parent });
    const e21 = Lexon.create({ tags: { f2: 1 }, parent });
    const e22 = Lexon.create({ text:'e22', tags: { f2: 1 }, parent });

    assert.equal(pattern.apply(e1).text, e22.text);

  });

  xit('separatedList', ()=> {

    const pattern = Pattern.create('e').separatedList('sep');

    const parent = Lexon.create({ tags:{} });
    const e1 = Lexon.create({ tags: { e: 1 }, parent });
    const sep1 = Lexon.create({ tags: { sep: 1 }, parent });
    const e2 = Lexon.create({ tags: { e: 1 }, parent });
    const sep2 = Lexon.create({ tags: { sep: 1 }, parent });
    const e3 = Lexon.create({ tags: { e: 1 }, parent });
    const sep3 = Lexon.create({ tags: { sep: 1 }, parent });
    const e4 = Lexon.create({ text:'e4', tags: { e: 1 }, parent });

    assert.equal(pattern.apply(e1).text, e4.text);

  });

});
