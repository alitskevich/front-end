/**
 * JS runtime entry point.
 */
function MAIN(HostDefined, Source, ...Args) {

  // global variables
  const Vars = { ...Intrinsics, ...HostDefined }
  // global scope
  const Scope = struct.VariableScope({ Vars, OuterScope: UNDEFINED })
  // global context
  $$STACK_PUSH(struct.ExecutionContext({ Scope }))
  // global functional block
  const Main = struct.Code({
    Name: 'main',
    // to be root for any variable scope
    Closure: Scope,
    ...$$TRANSLATE(Source),
    Catch: [()=> console.error($$ARGS[0])]
  })
  // evaluate main. the global object as This
  $$CODE_APPLY(Main, $$OBJ(Vars), Args)
}

const JSRuntime = new Program({
  main(API, args){
    file = API.io.openFile(args[0])
    text = file.ReadAll()
    MAIN(Window, text, args.slice(1))
  }
})

OS_INSTALL(DEVICE()).Run(JSRuntime)
