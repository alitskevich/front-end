import assert from 'assert';
import Pattern from './Pattern.js';
import Rule from './Rule.js';
import Lexon from './Lexon.js';
import Nil from './Nil.js';

xdescribe('Grammar:Rule', function () {

    it('basic', ()=> {

        const pattern = Pattern.create('f1').and('f2');

        const rule = Rule.create('rule', pattern);

        const e12 = Lexon.create({ tags: { f1: 1, f2: 1 } });

        assert.equal(rule.apply(e12), e12);
        assert.equal(e12.is('rule'), e12);

        const e3 = Lexon.create({ tags: { f3: 1 } });
        assert.equal(rule.apply(e3), Nil);
    });

    it('wrap', ()=> {

        const pattern = Pattern.create('f1').repeatNext('f2');

        const rule = Rule.create('rule_wrap', pattern, 'wrap');

        const parent = Lexon.create({ text:'parent', tags:{} });
        const e1 = Lexon.create({ text:'e1', tags: { f1: 1 }, parent });
        const e20 = Lexon.create({ text:'e20', tags: { f2: 1 }, parent });
        const e21 = Lexon.create({ text:'e21', tags: { f2: 1 }, parent });
        const e22 = Lexon.create({ text:'e22', tags: { f2: 1 }, parent });
        const e3 = Lexon.create({ text:'e3', tags: { f3: 1 }, parent });

        const result = rule.apply(e1);

        assert(result.is('rule_wrap'), 'result wrap');
        assert.equal(parent.first, result, 'parent first');
        assert.equal(result.first.text, e1.text, 'first wrapped');
        assert.equal(result.last.text, e22.text, 'last wrapped');
        assert.equal(result.next.text, e3.text, 'next after wrapped');

    });

});
