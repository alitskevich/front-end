const CALL_STACK = [];

const ScriptEngine = {

    DefFn(Parameters, SourceCode, CompiledBody, This, Catch) {

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
            Prototype: {Constructor:Fn},
            Catch
        };

        return Fn;
    },

    CallFn(Fn, This, Args = []) {

        const currentContext = new ExecutionContext(Fn)
        
        CALL_STACK.unshift(currentContext);
        
        Fn.Body.call(null, this, Fn.This || This, Args);

        CALL_STACK.shift();
        
        if (currentContext.Error) {

            throw currentContext.Error;

        } else {

           return currentContext.Result;
        }

        currentContext.destroy();
       
    },

    ExitWithResult(Result) {

        const currentContext = CALL_STACK[0];

        currentContext.Result = Result;
    },

    ExitWithError(Error) {

        const currentContext = CALL_STACK[0];

        currentContext.Error = Error;
    },

    NewObj(Fn, Args) {

        var This = new Obj(Fn.Prototype);

        this.CallFn(Fn, This, Args);

        return This;
    },

    GetValue(Id) {

        const currentContext = CALL_STACK[0];

        return currentContext.LexicalEnvironment.GetValue(Id);
    },

    AssignValue(Id) {

        const currentContext = CALL_STACK[0];

        return currentContext.LexicalEnvironment.AssignValue(Id);
    }
};
