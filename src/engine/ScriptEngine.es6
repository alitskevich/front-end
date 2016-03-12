const CALL_STACK = [];

const ScriptEngine = {

    DefFn(Parameters, SourceCode, CompiledBody, This) {

        var Variables = [];

        function compile(SourceCode) {
            // collect variable declarations
            SourceCode.replace(/var (\w*)/g, (s, name) => Variables.push(name));

            return CompiledBody;
        }

        const currentContext = CALL_STACK[0];

        const Fn = {
            Closure: currentContext,
            Parameters,
            Variables,
            This,
            Body: compile(SourceCode),
            Prototype: {Constructor:Fn}
        };

        return Fn;
    },

    CallFn(Fn, This, Args = []) {

        var Lexen = new LexicalEnvironment(Fn);

        CALL_STACK.unshift(new ExecutionContext(Lexen));
        try {

            Fn.Body.call(null, this, Lexen, Fn.This || This, Args);

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
