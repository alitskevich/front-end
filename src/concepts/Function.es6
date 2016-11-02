<class> Function
public:
  <new>(scope: Object, params: Array<tuple[name,type]>, code: string)
  apply(context:Object, arguments:Array<any>)  
  
member
  context: Object
  closure: Object
  params: Array<tuple[name,type]>
  body: CODE
  
implementation:

  <new>(scope, params, code){
    
    @ = ALLOC()
    @closure := scope
    @params = params
    @code = code
    (@body, @vars) = COMPILE(code)
    return @
    
  apply(context:Object = @context, arguments:Array<any>)
    
    scope := new Object(@closure)
    
    @params.each((param, index) -> scope.set(param.name, arguments[index])
    @vars.each((var) -> scope.set(var.name, UNDEFINED)
    
    EVAL(scope, context, arguments, @body); 
