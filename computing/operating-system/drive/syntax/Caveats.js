// Javascript Engine bring to front a lot of caveats.
///////////////////////////////////
// 1. Numbers, Strings and Operators

// JavaScript has one number type (which is a 64-bit IEEE 754 double).
// Doubles have a 52-bit mantissa, which is enough to store integers
// up to about 9✕10¹⁵ precisely.

// JavaScript is not the language for precise calculations
10000000000000009 + 10000000000000008; // 20000000000000016

3; // = 3
1.5; // = 1.5
.5; // = 0.5
1.13e4; // = 13400

// hexadecimal should start from 0x or 0X
0xfffcc;

// Some basic arithmetic works as you'd expect.
1 + 1; // = 2
0.1 + 0.2; // = 0.30000000000000004
8 - 1; // = 7
10 * 2; // = 20
35 / 5; // = 7

// Including uneven division.
5 / 2; // = 2.5

// And modulo division.
10 % 2; // = 0
30 % 4; // = 2
18.5 % 7; // = 4.5


// Bitwise operations also work; when you perform a bitwise operation your float
// is converted to a signed int *up to* 32 bits.
1 << 2; // = 4

// Precedence is enforced with parentheses.
(1 + 3) * 2; // = 8

// There are three special not-a-real-number values:
Infinity; // result of e.g. 1/0
-Infinity; // result of e.g. -1/0
NaN; // result of e.g. 0/0, stands for 'Not a Number'

// There's also a boolean type.
true;
false;

// Strings are created with ' or ".
'abc';
"Hello, world";

// Negation uses the ! symbol
!true; // = false
!false; // = true

// Equality is ===
1 === 1; // = true
2 === 1; // = false

// Inequality is !==
1 !== 1; // = false
2 !== 1; // = true

// More comparisons
1 < 10; // = true
1 > 10; // = false
2 <= 2; // = true
2 >= 2; // = true

// Strings are concatenated with +
"Hello " + "world!"; // = "Hello world!"

// ... which works with more than just strings
"1, 2, " + 3; // = "1, 2, 3"
"Hello " + ["world", "!"] // = "Hello world,!"

// and are compared with < and >
"a" < "b"; // = true

// Type coercion is performed for comparisons with double equals...
"5" == 5; // = true
null == undefined; // = true

// ...unless you use ===
"5" === 5; // = false
null === undefined; // = false

// ...which can result in some weird behaviour...
13 + !0; // 14
"13" + !0; // '13true'

// You can access characters in a string with `charAt`
"This is a string".charAt(0);  // = 'T'

// "charAt" function available, because interpreter doing this ...
new String("This is a string").charAt(0);

// ...or use `substring` to get larger pieces.
"Hello world".substring(0, 5); // = "Hello"

// same as for "charAt"
new String("Hello world").substring(0, 5);

// `length` is a property, so don't use ().
"Hello".length; // = 5

// ... interpreter just wraps primitive in Object
new String("Hello").length;

// There's also `null` and `undefined`.
null;      // used to indicate a deliberate non-value
undefined; // used to indicate a value is not currently present (although
           // `undefined` is actually a value itself)

// Note that 0 is falsy and "0" is truthy, even though 0 == "0".

// to indicate the type of the unevaluated operand, use "typeof" operator
typeof 1; // "number"
typeof ""; // "tring"
typeof false; // "boolean"
typeof new String(""); // "object"
typeof undefined; // "undefined"
typeof null; // "object" !!! weird behaviour...
