import { GlobalContext, FunctionCreate } from './native';
import { Program } from './Program.js';

export class Script extends Program {

  run() {

    const Context = GlobalContext(this.process.stack);

    const Fn = FunctionCreate({ Code:this.code });

    return Fn.Apply(Context, this.params);
  }

}
