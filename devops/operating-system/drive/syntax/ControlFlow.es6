///////////////////////////////////
// 3. Logic and Control Structures

// && and || "short circuit", which is useful for setting default values.
var name = otherName || 'default';


// The `if` structure works as you'd expect.
function theIfElse(count = 1) {

    if (!count) {
        return 0;
    }

    if (count === 3) {
        // evaluated if count is 3
    } else if (count === 4) {
        // evaluated if count is 4
    } else {
        // evaluated if it's not either 3 or 4
    }

}

function theWhile(count = 100) {

    while (count) {

        let enough = count > 50 * Math.random();

        if (enough) {
            break;
        }

        count--;
    }
}

function iterators(count = 100) {

    for (var i = 0; i < count; i++) {
        // will run 5 times
    }
}

// To only consider properties attached to the object itself
// and not its prototypes, use the `hasOwnProperty()` check.
var description = '';
var person = { fname:'Paul', lname:'Ken', age:18 };
for (var x in person) {
    if (person.hasOwnProperty(x)) {
        description += person[x] + ' ';
    }
}

/**
 * Rarely used
 */

// Do-while loops are like while loops, except they always run at least once.
var input;
do {
    input = getInput();
} while (!isValid(input));

// The `for` loop is the same as C and Java:
// initialisation; continue condition; iteration.


// The `switch` statement checks for equality with `===`.
// Use 'break' after each case
// or the cases after the correct one will be executed too.
grade = 'B';
switch (grade) {
    case 'A':
        console.log('Great job');
        break;
    case 'B':
        console.log('OK job');
        break;
    case 'C':
        console.log('You can do better');
        break;
    default:
        console.log('Oy vey');
        break;
}
