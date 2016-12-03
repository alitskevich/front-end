export default class ScriptTranslator {

    static translate(SourceCode, Body){

        var Variables = [];

        // collect variable declarations
        SourceCode.replace(/var (\w*)/g, (s, name) => Variables.push(name));

        return {Variables, Body};

    }

}