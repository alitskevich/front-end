import  Realm from './Realm.es6';

export default class ExecutionContext {

    constructor({This, OuterScope, PreviousContext}) {

        this.This = This;

        this.Scope = new Obj(OuterScope);

        this.PreviousContext = PreviousContext;

        this.Realm = Realm;

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

        return this.Scope.Set(Id, Value);
    }

    Exit() {

        this.Scope.$release();

        return this.PreviousContext;
    }
}
