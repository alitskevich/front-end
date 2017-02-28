/**
 * Created by Aliaksandr_Litskevic on 9/7/2015.
 */
import { tokenizer } from './text.js';
import assert from 'assert';

const TEXT = 'One two; three3 \'меллодия\'';

describe('TextUtils', function () {

    it('tokensGenerator', ()=>{

        let q = [];
        tokenizer(/[^a-zа-я0-9]/gi, (ctx, [e, flag])=>q.push(e), TEXT);

        let result = q.map(e=>`${e}`).join('-');

        assert.equal(result, `One- -two-;- -three3- -'-меллодия-'`);
    });

});
