import { GlobalContext, FunctionCreate } from './native';
import { Program } from './Program.js';

export class ScriptEngine extends Program {

  static run() {

    const Context = GlobalContext(this.process.stack);

    const Fn = FunctionCreate({ Code:this.code });

    return Fn.Apply(Context, this.params);
  }

}
