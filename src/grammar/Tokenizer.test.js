import assert from 'assert';
import Lexon from './Lexon.js';
import { textTokenizer } from './Tokenizer.js';

describe('Grammar:Tokenizer', function () {

  const SAMPLES = {
    [`1 a bc`]: ['number', 'space', 'latin _a', 'space', 'latin _bc'],
    [`a b&cde`]: ['latin _a', 'space', 'latin _b', 'ampersand', 'latin _cde']
  };

  Object.keys(SAMPLES).forEach((key)=> {

    it(key, ()=> {

      var top = Lexon.create();

      textTokenizer(key, top);

      let lx = top.first;
      SAMPLES[key].forEach(k=>{
        assert(lx.isAny(...k.split(' ')), `${lx} is not ${k}`);
        lx = lx.next;
      });

    });
  });
});
