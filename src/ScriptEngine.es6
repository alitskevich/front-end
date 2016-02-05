const ExecutionStack = [];

// логика разрешения переменных
const ScriptEngine = {

    GetExecutionContext() {
        return ExecutionStack[0] || {};
    },

    Return(retValue) {
        this.GetExecutionContext().Result = retValue;
        throw new Error('ok');
    },

    ThrowError(message) {
        var error = new Error(message);
        this.GetExecutionContext().Error = error;
        throw error;
    },

    DefFn(Parameters, SourceCode, CompiledBody) {

        var Variables = [];

        function compile(SourceCode) {
            SourceCode.replace(/var (\w*)/, (s, name) => Variables.push(name));
            return CompiledBody;
        }

        return {
            Closure: this.GetExecutionContext().LexicalEnvironment,
            Parameters,
            Variables,
            Body: compile(SourceCode),
            Prototype: {}
        }
    },

    CallFn(Fn, This, Args=[]) {
        var Lx = new LexicalEnvironment(Fn.Closure)
        var Context = {
            LexicalEnvironment: Lx,
            Result: undefined,
            Error: undefined
        };

        // define all parameters and variables
        [...Fn.Parameters, ...Fn.Variables].forEach((name, i) => {
            Lx.DefVar(name)
        });

        // initialize parameters with arguments values
        Fn.Parameters.forEach(
            (name, i) => {
                Lx.AssignValue(name, Args[i])
            });

        this.ExecutionStack.unshift(Context);
        try {

            Fn.Body.call(null, this, Lx, This, Args);
        } catch (ex) {

            if (Context.Error) {
                throw Context.Error
            }
        } finally {
            this.ExecutionStack.shift();
        }

        return Context.Result;
    },

    NewObj(Fn, Args) {
        var This = new Obj(Fn);

        This.Constructor = Fn;
        This.__Proto__ = Fn.Prototype;

        this.CallFn(Fn, This, Args);

        return This;
    },

    Out(content) {
        document.getElementById('out').innerHTML = content
    }
}
