// Monad - a value wrapper with map, join,chain,ap
class Monad {

    //Monad.of is simpler than "new Monad(val)
    static of(value) {
        return new Monad(value);
    };
    
    constructor(value) {
        this.value = value;
    }
    
    //Applies the function but returns another Monad!
    map(f) {
        return Monad.of(f(this.value));
    }
    
    // used to get the value out of the Monad
    join() { 
        return this.value;
    }
    
    //Helper func that maps and then gets the value out
    chain(f) {
        return this.map(f).join();
    }
    
    //Used to deal w/ multiple Monads
    ap(someOtherMonad) {
        return someOtherMonad.map(this.value);
    }
}
