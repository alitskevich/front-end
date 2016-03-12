class LexicalEnvironment {

    constructor(Fn) {

        const Outer = Fn.Closure && Fn.Closure.LexicalEnvironment;

        this.Bindings = new Obj(Outer.Bindings);

        // define parameters and initialize them with arguments values in order of appearance
        Fn.Parameters.forEach((name, i) => Lexen.DefVar(name, Args[i]));

        // define all variables BEFORE any execution, e.g. Hoisting
        Fn.Variables.forEach((name) => Lexen.DefVar(name));

    }

    GetVar(id) {

        if (!this.Bindings.HasPropertyDefinition(id, true)){

            throw new Error(`ReferenceError: variable '${id}' is not defined`);
        }

        return this.Bindings.GetPropertyDefinition(id);

    }

    DefVar(id, Value = undefined) {

        if (this.Bindings.HasPropertyDefinition(id, false)){

            throw new Error(`ReferenceError: variable '${id}' is already defined`);
        }

        this.Bindings.DefineProperty(id, {Value});
    }

    Value(id) {

        return this.GetVar(id).Value;
    }

    AssignValue(id, value) {

        //GC.retain(value);

        return this.GetVar(id).Value = value;
    }

    Done() {

        //Bindings for each GC.release(value);
    }
}