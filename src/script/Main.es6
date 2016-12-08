import  ExecutionContext from './ExecutionContext.es6';
import  ScriptEngine from './ScriptEngine.es6';

const globalContext = new ExecutionContext(null);

const scriptEngine = new ScriptEngine(globalContext);

const __main__ = scriptEngine.DefineFunction({

    Name: '__main__',
    Parameters:[],
    SourceCode:`

        var prefix = "Hi";

        var User = function(name) {

            this.name = name;

            this.greeting = function(){ return prefix + ', ' + this.name};
        }

        var user = new User('John');

        return user.greeting();
    `
    ,
    CompiledBody: function ($) {

        $.AssignVariable('prefix', 'Hi');

        $.AssignVariable('User', $.DefineFunction(/*...*/));

        $.AssignVariable('user', $.NewObject($.GetValue('User'), ['John']));

        $.ExitWithResult( $.ApplyFunction($.GetValue('user.greeting'), $.GetValue('user'), []));
    }
});

scriptEngine.ApplyFunction(__main__, globalContext, []);
