
export default class ScriptTranslator {

    static translate(SourceCode, Body) {

        var Variables = [];

        // collect variable declarations
        SourceCode.replace(/var (\w*)/g, (s, name) => Variables.push(name));

        return { Variables, Body };

    }
}

export function ensureCodeIsTranslated(Fn) {
    if (!Fn.Body) {
      const { Body, Variables } = ScriptTranslator.translate(Fn.Code);
      Fn.Body = Body;
      Fn.Variables = Variables;
    }
}

export function compileTryCatch(Try, Catch, Finally) {

  const context = ApplyFunction(Try);

  // check for exception
  if (context.Exception) {
    const Exception = context.Exception;

    if (Fn.Catch) {
      context.Result = ApplyFunction(Fn.Catch, context.This, [Exception]);
    } else {
      Object.assign(Context.Top, { Exit: true, Exception });
    }
  }

  // Apply Final block if any
  if (Fn.Finally) {
    context.Result = ApplyFunction(Fn.Finally, context.This);
  }

}
