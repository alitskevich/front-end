class LexicalEnvironment {

    constructor(Outer) {

        this.Bindings = new Map();
        this.Outer = Outer;
    }

    GetVar(id) {

        if (this.Bindings.has(id)) return this.Bindings.get(id);
        if (this.Outer) return this.Outer.GetVar(id);
        throw new Error(`ReferenceError: variable '${id}' is not defined`);
    }

    DefVar(id) {
        if (this.Bindings.has(id))
            throw new Error(`ReferenceError: variable '${id}' is already defined`);
        this.Bindings.set(id, {
            Value: undefined
        });

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