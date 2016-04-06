import  Realm from './Realm.es6';
import CreateObject from './CreateObject.es6'

export default class ExecutionContext {

    constructor({This, LexicalContext, Catch, Engine}) {

        this.This = This;

        this.VariableScope = CreateObject(LexicalContext.VariableScope);

        this.Realm = Realm;

        this.Engine = Engine;

    }

    $release() {

        this.This = null;

        this.VariableScope.$release();
    }

    //////////////////////////////////////
    // Variables
    //////////////////////////////////////

    DefineVariable(Id, Value = undefined) {

        if (this.VariableScope.HasOwnPropertyDefinition(Id)) {

            throw new Error(`ReferenceError: variable '${Id}' is already defined`);
        }

        this.VariableScope.DefineProperty(Id, {Value});
    }

    GetValue(Id) {

        if (!this.VariableScope.HasPropertyDefinition(Id)) {

            throw new Error(`ReferenceError: variable '${Id}' is not defined`);
        }

        return this.VariableScope.GetPropertyDefinition(Id).Value;
    }

    AssignValue(Id, Value) {

        return this.VariableScope.Set(Id, Value);
    }

    //////////////////////////////////////
    // Control Flow
    //////////////////////////////////////

    ExitWithResult(Result) {

        return this.Engine.ExitFunctionWithResult(Result);
    }

    ExitWithError(Error) {

        return return this.Engine.ExitFunctionWithError(Error);

    }
}
