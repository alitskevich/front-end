
const Global = new LexicalEnvironment(null);

function __main__($, This) {
    // var User = function(name){ this.name = name;}
    var User = $.DefFn(['name'], 'this.name = name', ($, This) => {
        This.Set('name', $.GetValue('name'));
    });

    User.Prototype.title = "Mr."

    //var user = new User('John')
    var user = $.NewObj(User, ['John']);

    var sum = $.DefFn(['a', 'b'],
        `
        var result = a+b;
        return resut;
        `,
        ($, This) => {

            $.AssignValue('result', $.Realm.PLUS($.GetValue('a'), $.GetValue('b')));

            $.ExitWitResult($.GetValue('result'));
        }
    )

    // передаётся контекст null и список аргументов
    $.Out($.CallFn(sum, null, [2, 7]));
};

__main__(Script, Global, Global);