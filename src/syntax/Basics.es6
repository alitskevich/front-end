
/*
 * Comments
 */

// inline comment


///////////////////////////////////
// 2. Variables, Arrays and Objects

// Variables are declared with the `var` keyword.
// JavaScript is dynamically typed, so you don't need to specify type

// Variables declared without being assigned to are set to undefined.
var someThirdVar; // = undefined

// Assignment uses a single `=` character.
var someVar = 5;

// If you want to declare a couple of variables
var someFourthVar = 2, someFifthVar = 4;

// Arrays are ordered lists of values, of any type.
var myArray = ["Hello", 45, true];

// Their members can be accessed using the square-brackets subscript syntax.
// Array indices start at zero.
myArray[1]; // = 45

// Arrays are mutable and of variable length.
myArray.push("World");
myArray.length; // = 4
// Add/Modify at specific index
myArray[3] = "Hello";

// JavaScript's objects are equivalent to "dictionaries" or "maps" in other
// languages: an unordered collection of key-value pairs.
var myObj = {key1: "Hello", key2: "World"};

// Keys are strings, but quotes aren't required if they're a valid
// JavaScript identifier. Values can be any type.
var myObj = {myKey: "myValue", "my other key": 4};

// Object attributes can also be accessed using the subscript syntax,
myObj["my other key"]; // = 4

// ... or using the dot syntax, provided the key is a valid identifier.
myObj.myKey; // = "myValue"

// Objects are mutable; values can be changed and new keys added.
myObj.myThirdKey = true;

// If you try to access a value that's not yet set, you'll get undefined.
myObj.myFourthKey; // = undefined


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
