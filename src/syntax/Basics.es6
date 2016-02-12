
/*
 * Comments
 */

// inline comment

var someThirdVar /* = undefined */ , someFifthVar = 4;

var myArray = ["Hello", 45, true];

myArray[1]; // = 45

var myObj = {
    myString: "Hello world!",
    myFunc: function(){
        return this.myString;
    }
};

myObj["my other key"]

myObj.myKey

myObj.myThirdKey = true;



// Sugar

// There's shorthand for performing math operations on variables:
var someVar = 5;
someVar += 5; // someVar = someVar + 5;
someVar *= 10; // now someVar is 100

// and an even-shorter-hand for adding or subtracting 1
someVar++; // now someVar is 101
someVar--; // back to 100




//// Caveats
// If you leave the var keyword off, you won't get an error...
someOtherVar = 10;

// ...but your variable will be created in the global scope, not in the scope
// you defined it in.
