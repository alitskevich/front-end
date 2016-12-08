import Algebra from './Algebra.js';

export class Identity extends Algebra {
    
    static of = a => new Identity(a);
    
    constructor(a) {
        
        // used to get the value out of the Monad
        this.get = () => a;
    }
    
    chain(f) {
        
        return f(this.get());
    }

}