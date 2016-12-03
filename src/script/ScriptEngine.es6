import CreateObject from './CreateObject.es6'

export class ScriptEngine {

    constructor(InitialContext){

        this.ExecutionStack = [InitialContext];
    }

    //////////////////////////////////////
    // Objects
    //////////////////////////////////////

    CreateObject(Prototype) {

        return CreateObject(Prototype);
    }

    NewObject(ConstructorFn, Args) {

        var Obj = CreateObject(ConstructorFn.Prototype);

        this.ApplyFunction(ConstructorFn, Obj, Args);

        return Obj;
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
            LexicalContext: this.ExecutionContext
        };

        return Fn;
    }

    ApplyFunction(Fn, This, Args = []) {

        const CurrentContext = new ExecutionContext({
            This: Fn.BoundThis || This,
            LexicalContext: Fn.LexicalContext,
            Catch: Fn.Catch,
            Engine: this,
        });

        this.ExecutionStack.unshift(CurrentContext);

        // define parameters and initialize them with arguments values in order of appearance
        Fn.Parameters.forEach((name, i) => this.DefineVariable(name, Args[i]));

        // define all variables BEFORE any execution, e.g. Hoisting
        Fn.Variables.forEach((name) => this.DefineVariable(name));

        const Result = Fn.Body.apply(CurrentContext, Args);

        return Result;
       
    }

    ExitFunctionWithResult(Result) {

        this.ExecutionStack.shift();

        return Result;
    }

    ExitFunctionWithError(Error) {

        let CurrentContext = this.ExecutionStack[0];

        while(!CurrentContext.Catch){

            CurrentContext = this.ExecutionStack.shift();
        }

        const Result = this.ApplyFunction(CurrentContext.Catch, CurrentContext.This, [Error]);

        this.ExecutionStack.shift();

        return Result;

    }


}