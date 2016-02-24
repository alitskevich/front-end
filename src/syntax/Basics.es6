/**
 * This file intended to contain all syntax construction of JS
 * 
 */
import some from 'other.js';

// inline comment
var someThirdVar /* = undefined */ , someFifthVar = 4;

const CONFIG = {
    
    key: value,
    
    sub : {
        key1: true
    },
    
    array : [1,2,3,4],
    
    myString: "Hello world!",
    
    myFunc: function(){
        return this.myString;
    }
};

export const helper = (a, b) => (this._id+a+b);

export default class SomeClass {
    
    static factory(opts){
        
        return new SomeClass(opts);
    }
    
    constructor(opts){
        
        Object.assign(this, opts);
        
        this._id  = COUNT++;
        this.id = this::helper(1,3)
    }
    
    method(param, param2, ...rest){
        
        for (let item of rest) {
            
            this.method2(item, param)
        }
        
        return rest.filter((e)=>(e>0)).map((e)=>(2*e)).reduce((r, e)=>{r.push(e); return r},[])
    }
    
    method2(item = {}, param){
        var myArray = ["Hello", 45, true];

        myArray[1]; // = 45
        
        var myObj = {
        };
        
        myObj["my other key"]
        
        myObj.myKey
        
        myObj.myThirdKey = true;
    }
    
    sugar(){
        
        // Sugar
        
        // There's shorthand for performing math operations on variables:
        var someVar = 5;
        someVar += 5; // someVar = someVar + 5;
        someVar *= 10; // now someVar is 100
        
        // and an even-shorter-hand for adding or subtracting 1
        someVar++; // now someVar is 101
        someVar--; // back to 100


    }
    
    caveats() {
        //// Caveats
        // If you leave the var keyword off, you won't get an error...
        someOtherVar = 10;
        
        // ...but your variable will be created in the global scope, not in the scope
        // you defined it in.
    }
}
