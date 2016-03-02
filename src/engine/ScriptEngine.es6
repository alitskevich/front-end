const CALL_STACK = [];

const ScriptEngine = {

    DefFn(Parameters, SourceCode, CompiledBody) {

        var Variables = [];

        function compile(SourceCode) {
            // collect variable declarations
            SourceCode.replace(/var (\w*)/g, (s, name) => Variables.push(name));

            return CompiledBody;
        }

        const currentContext = ;

        const Fn = {
            Closure: CALL_STACK[0],
            Parameters,
            Variables,
            Body: compile(SourceCode),
            Prototype: {Constructor:Fn}
        }
        return Fn;
    },

    CallFn(Fn, This, Args = []) {

        var Lexen = new LexicalEnvironment(Fn.Closure && Fn.Closure.LexicalEnvironment);

        // define all parameters and variables BEFORE any execution, e.g. Hoisting
        [...Fn.Parameters, ...Fn.Variables].forEach((name) => Lexen.DefVar(name));

        // initialize parameters with arguments values in order of appearance
        Fn.Parameters.forEach((name, i) => Lexen.AssignValue(name, Args[i]));

        CALL_STACK.unshift(new ExecutionContext(Lexen));
        try {

            Fn.Body.call(null, this, Lexen, This, Args);

        } finally {

            var Context = CALL_STACK.shift();
            try {

                if (Context.Error) {

                    throw Context.Error;

                } else {

                    return Context.Result;
                }

            } finally {

                Context.destroy();
            }
        }
    },

    ExitFn(Error, Result) {
        const currentContext = CALL_STACK[0];

        currentContext.Error = Error;
        currentContext.Result = Result;

        throw new Error('ok');
    },

    NewObj(Fn, Args) {

        var This = new Obj(Fn.Prototype);

        this.CallFn(Fn, This, Args);

        return This;
    }
};
