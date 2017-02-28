import assert from 'assert';
import Lexon from '../src/core/Lexon.js';
import Grammar from '../src/grammar';
import Html from '../src/utils/HtmlUtils.es6';

const RULES = {

    phone: 'mobile|home',

    mobile: 'international|local',

    home: 'number&x6',

    international: 'plus ~ number&x3 ~ number&x9',
    local: 'number&x11',
    bracedNumber: {
        expr: 'leftBrace ~ num:(number&short)  ~ rightBrace ~ minus?',
        action: ({ id, base, target, refs }) => {
            let number = refs.num.last.text;
            return base.wrap(target).setStyle(`number ${id} x${number.length}`).setText(number);
        }
    },
    dashedNumber: {
        expr: 'number&short ~ rest:(minus ~ number&short)+',
        action: ({ id, base, target, refs }) => {
            let number = base.range(target, lx=>lx.is('number')).reduce((s, lx)=>(s + lx.text), '');
            return base.wrap(target).setStyle(`number ${id} x${number.length}`).setText(number);
        }

    }
};

const SAMPLES = {

    [`511508`]: 1,
    [`51-1-508`]: 1,
    [`51-15-08`]: 1,
    [`8-029-308-15-08`]: 1,
    [`+(372)-29-308-15-08 foams`]: 1

};

xdescribe('ArithmeticTest', function () {
 xit('test', ()=>{
    const grammar = new Grammar(RULES);
    Object.keys(SAMPLES).forEach((text)=> {
        it(text, ()=> {
            var top = new Lexon();

            Html.tokenize(top, text);

            grammar.apply(top.first);

            console.log(text + ':\n' + top);

            assert.equal(top.first.is('phone'), true);

        });
    });
 });

});
