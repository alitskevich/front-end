
export default class ExecutionContext {

    constructor(Fn, PreviousExecutionContext) {

        this.Fn = Fn;
        this.PreviousExecutionContext = PreviousExecutionContext;
        this.LexicalEnvironment = new LexicalEnvironment(Fn);
        this.Result =  undefined;
        this.Error = undefined;
    }

    Done() {
        this.LexicalEnvironment.Done();
    }
}
