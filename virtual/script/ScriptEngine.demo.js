import ScriptEngine from './ScriptEngine.es6';
import HelloWorld from './samples/Hello.js';

const Global = { console };

ScriptEngine.run({

  This: Global,

  Code: HelloWorld
});
