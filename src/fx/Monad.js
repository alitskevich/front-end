import Identity from './Identity.js';

// Monad - a value wrapper with map, join,chain,ap
export class Monad  extends Identity {

    //Monad.of is simpler than "new Monad(val)
    static of = a => new Monad(a);
    
    //Applies the function but returns another Monad!
    map(f) {
        
        return Monad.of(f(this.get()));
    }
    
    //Helper func that maps and then gets the value out
    chain(f) {
        
        return this.map(f).get();
    }
    
    //Used to deal w/ multiple Monads
    ap(otherMonad) {
        
        return otherMonad.map(this.get());
    }

}