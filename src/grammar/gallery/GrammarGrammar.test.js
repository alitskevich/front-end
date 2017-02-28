import assert from 'assert';
import Lexon from '../Lexon.js';
import Grammar from '../Grammar.js';
import GrammarGrammar from './GrammarGrammar.js';
import { textTokenizer } from '../Tokenizer.js';

xdescribe('GrammarGrammar', function () {

  const SAMPLES = [
    'name',
    'name name* name*',
    'name name* name[sep] name[sep]*'
  ];

  SAMPLES.forEach((key)=> {

    it(key, ()=> {

      const grammar = new Grammar(GrammarGrammar);

      var top = Lexon.create();

      textTokenizer(key, top);

      top.removeChildren('space');

      grammar.apply(top);

      console.log(key + ':\n' + top.first);

      assert(top.first.is('Pattern'), `pattern ${key}`);

      top.forEachChild(lx=>{
        assert(lx.is('Criteria').someOrNull(), `${lx} is not Criteria`);
      });
    });
  });
});
