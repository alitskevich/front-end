import GC from './GarbageCollector.es6';

export default class ExecutionContext {

    constructor({This, OuterScope, PreviousContext}) {

        this.This = This;

        this.Scope = new Obj(OuterScope);

        this.PreviousContext = PreviousContext;
    }

    DefineVariable(Id, Value = undefined) {

        if (this.Scope.HasOwnPropertyDefinition(Id)) {

            throw new Error(`ReferenceError: variable '${Id}' is already defined`);
        }

        this.Scope.DefineProperty(Id, {Value});
    }

    GetValue(Id) {
        if (!this.Scope.HasPropertyDefinition(Id)) {

            throw new Error(`ReferenceError: variable '${Id}' is not defined`);
        }

        return this.Scope.GetPropertyDefinition(Id).Value;
    }

    AssignValue(Id, Value) {

        GC.retain(Value, this.GetValueOfVariable(Id));

        return this.Scope.Set(Id, Value);
    }

    Exit() {

        GC.releaseAll(this.Scope);

        return this.PreviousContext;
    }
}
