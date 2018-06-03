export default `
var prefix = "Hi";

var User = function(name) {

    this.name = name;

    this.greeting = function(){ return prefix + ', ' + this.name};
}

var user = new User('John');

return user.greeting();
`;