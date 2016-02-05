
const Global = new LexicalEnvironment(null);

function __main__($, Lx, This) {
    // var User = function(name){ this.name = name;}
    var User = $.DefFn(['name'], 'this.name = name', ($, Lx, This) => {
        This.Set('name', Lx.Value('name'));
    });

    User.Prototype.title = "Mr."

    //var user = new User('John')
    var user = $.NewObj(User, ['John']);

    var sum = $.DefFn(['a', 'b'],
        `
        var result = a+b;
        return resut;
        `,
        ($, Lx, This) => {
            Lx.AssignValue('result', Operations.PLUS(Lx.Value('a'), Lx.Value('b')));
            $.Return(Lx.Value('result'));
        }
    )

    // передаётся контекст null и список аргументов
    $.Out($.CallFn(sum, null, [2, 7]));
};

__main__(Script, Global, Global);