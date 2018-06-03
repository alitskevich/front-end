const Window = HASH({})
const Document = HASH({})
Window.window = Window
Window.document = Document
Window.alert= function(msg){
    // ...
}
  