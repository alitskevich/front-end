import { equal } from 'assert';
import { narrowTest, times } from './Pattern.js';
import Nil from './Nil.js';

const obj = {
    flag: 1,
    is: key => key,
    isAny: (...keys) => keys.reduce((r, i)=>r + i, 0)
};

describe('PatternUtils', function () {

    beforeEach(() => {

    });

    it('narrowTest', ()=> {

        equal(narrowTest(a=>a)(1), 1);
        equal(narrowTest('1')(obj), '1');
        equal(narrowTest([1, 2, 3])(obj), 6);
    });

    it('times', ()=> {

        const fn = count => (x => x < count ? x + 1 : Nil);

        equal(times(fn(20), 0, 1 )(1), 2);
        equal(times(fn(0 ), 0, 1 )(2), 2);

        equal(times(fn(20), 0 )(0), 20);
        equal(times(fn(20), 0, 10)(0), 10);
        equal(times(fn(20), 0, 20)(0), 20);

        equal(times(fn(20), 21, 30)(0), Nil);
        equal(times(fn(31), 21, 30)(0), 30);
    });

});
