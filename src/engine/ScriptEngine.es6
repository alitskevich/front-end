export class ScriptEngine {

    constructor(GlobalContext = {}, Realm = {}){

        this.CurrentContext = GlobalContext;
        this.Realm = Realm;
    }

    //////////////////////////////////////
    // Objects
    //////////////////////////////////////

    CreateObject(Prototype) {

        return new Obj(Prototype);
    }

    NewObject(ConstructorFn, Args) {

        var This = this.CreateObject(ConstructorFn.Prototype);

        this.ApplyFunction(ConstructorFn, This, Args);

        return This;
    }

    //////////////////////////////////////
    // Functions
    //////////////////////////////////////

    DefineFunction({Name, Parameters=[], SourceCode, CompiledBody, BoundThis = null, Catch, Prototype}) {

        const {Variables, Body} = ScrpitTranslator.translate(SourceCode, CompiledBody);

        const Fn = {
            Name,
            Parameters,
            Variables,
            Body,
            BoundThis,
            Catch,

            Prototype: {Constructor:Fn, ...Prototype},
            LexicalContext: this.CurrentContext
        };

        return Fn;
    }

    ApplyFunction(Fn, This, Args = []) {

        this.CurrentContext = new ExecutionContext({
            This: Fn.BoundThis || This,
            OuterScope: Fn.LexicalContext.Scope,
            PreviousContext: this.CurrentContext
        });

        // define parameters and initialize them with arguments values in order of appearance
        Fn.Parameters.forEach((name, i) => this.DefineVariable(name, Args[i]));

        // define all variables BEFORE any execution, e.g. Hoisting
        Fn.Variables.forEach((name) => this.DefineVariable(name));

        const Result = Fn.Body.apply(this.CurrentContext, Args);

        return Result;
       
    }

    ExitFunctionWithResult(Result) {

        this.CurrentContext = this.CurrentContext.Exit();

        return Result;
    }

    ExitFunctionWithError(Error) {

        let context = this.CurrentContext;

        while(!context.Catch){

            context = context.Exit();
        }

        this.CurrentContext = context;

        const Result = context.Catch.Body.apply(this.CurrentContext, [Error]);

        return this.ExitFunctionWithResult(Result);

    }

    //////////////////////////////////////
    // Variables
    //////////////////////////////////////

    DefineVariable(Id, InitialValue) {

        return this.CurrentContext.DefineVariable(Id, InitialValue);
    }

    GetValue(Id) {

        return this.CurrentContext.GetValueOfVariable(Id);
    }

    AssignValue(Id) {

        return this.CurrentContext.AssignValueOfVariable(Id);
    }
}