import assert from 'assert';
import Lexon from './Lexon.js';
import Morphology from './morphology.js';
import { textTokenizer } from './Tokenizer.js';
import meta from './resources/meta.json';

const SAMPLES = {
  [`Samples are substantly derived`]: ['latin __samp', 'be', 'latin __stant', 'latin _riv']
};

describe('Morphology', function () {

  Morphology.init(meta);

  Object.keys(SAMPLES).forEach((key)=> {

    it(key, ()=> {

      var top = Lexon.create();

      textTokenizer(key, top);

      top.removeChildren('space');

      Morphology.apply(top);

      let lx = top.first;
      SAMPLES[key].forEach(k=> {
        // console.log('lx', lx);
        assert(lx.isAny(...k.split(' ')), `${lx} is not ${k}`);
        lx = lx.next;
      });

    });
  });
});
