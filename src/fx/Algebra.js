class Algebra {
    
    constructor(value) {
        
        this.value = value; 
    }
    
    equals(other) {
        return (isFunction(other.get) && equals(this.get())(other.get()))
    }
    
    toString() {
        return 'Identity(' + this.val + ')'
    }
    
    inspect() {
        return this.toString()
    }
}

export const Semigroup = {
 
    operators: {
        
        append:(A, x ) => A.of( append(A.get(), x) )
    }
};

export const Functor = {
 
    operators: {
        
        map:(A, fxx ) => A.of( fxx( A.get() ) )
    }
};


export const Chain = {
 
    operators: {
        
        chain:(A, fxx ) => fxx( A.get() )
    }
};

export const Applicative = {
    
    extends: [Functor],
    
    operators: {
        
        op:($, functor) => functor.map($.get())
    }
};

export const land = {
    
    Semigroup,
    
    Functor,
    
    Applicative,
    
    Chain
    
}