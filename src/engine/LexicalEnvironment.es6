class LexicalEnvironment {

    constructor(Fn) {

        const OuterLexicalEnvironment = Fn.Closure && Fn.Closure.LexicalEnvironment;

        this.Scope = new Obj(OuterLexicalEnvironment.Scope);

        // define parameters and initialize them with arguments values in order of appearance
        Fn.Parameters.forEach((name, i) => this.DefVar(name, Args[i]));

        // define all variables BEFORE any execution, e.g. Hoisting
        Fn.Variables.forEach((name) => this.DefVar(name));

    }

    GetVar(id) {

        if (!this.Scope.HasPropertyDefinition(id)){

            throw new Error(`ReferenceError: variable '${id}' is not defined`);
        }

        return this.Scope.GetPropertyDefinition(id);

    }

    DefVar(id, Value = undefined) {

        if (this.Scope.HasOwnPropertyDefinition(id)){

            throw new Error(`ReferenceError: variable '${id}' is already defined`);
        }

        this.Scope.DefineProperty(id, {Value});
    }

    GetValue(id) {

        return this.Scope.Get(id);
    }

    AssignValue(id, value) {

        //GC.retain(value);

        return this.Scope.Set(id, Value);
    }

    Done() {

        //Bindings for each GC.release(value);
    }
}
