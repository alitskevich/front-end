import assert from 'assert';
import Lexon from '../src/core/Lexon.js';
import Grammar from '../src/grammar';
import Html from '../src/utils/HtmlUtils.es6';

const ACTION_WRAP_NOSIGNS = ({ id, base, target, refs }) => {
    return base.wrap(target).setStyle(id).removeChildren('sign');
};

const RULES = [

    {
        id: 'expr',
        entry: 'sum or product or op'
    },
    {
        id: 'sum',
        entry: 'addend',
        last: x => x.repeat(x=>x.nx('plus').nx('addend')),
        action: ACTION_WRAP_NOSIGNS
    },
    {
        id: 'product',
        entry: 'op',
        last: x => x.nx('asterisk', 'op').repeat(1),
        action: ACTION_WRAP_NOSIGNS
    },
    {
        id: 'addend',
        entry: 'op product'
    },
    {
        id: 'op',
        entry: 'number func braced',
        action: 'style'
    },
    {
        id: 'func',
        entry: 'lat',
        last: x => x.nx('leftBrace').repeat(x => x.nx('braced'), 0).nx('rightBrace'),
        action: ({ id, base, target, refs }) => {
            return base.wrap(target).setStyle(id);
        }
    },
    {
        id: 'braced',
        expr: 'leftBrace MAY(expr ~ MAY(comma expr)) rightBrace',
        action: ACTION_WRAP_NOSIGNS
    }
];

const SAMPLES = {

    [`1+2`]: 1,
    [`1+2+3+4+5`]: 1,
    [`1*2+3`]: 1,
    [`1+2*3+4*5*6`]: 1,
    [`s()`]: 1,
    [`s(1) s(1,2)`]: 1,
    [`s(1+2*3,s(1+2*3,4+5*6))`]: 1

};

xdescribe('ArithmeticTest', function () {

 xit('test', ()=>{
    const grammar = new Grammar(RULES);
    Object.keys(SAMPLES).forEach((text)=> {
        it(text, ()=> {
            var top = Html.parse(text);

            grammar.apply(top.first);

            console.log(text + ':\n' + top);

            assert.equal(top.first.is('expr'), true);

        });

    });
 });

});
