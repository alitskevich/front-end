
export default class ExecutionContext {

    constructor(Lx){

        this.LexicalEnvironment = Lx;
        this.Result =  undefined;
        this.Error = undefined;

    }
}