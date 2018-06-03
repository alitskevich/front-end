// https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Functions

const FunctionPrototype = OBJ({
  Get__Length: $ => $.Internal.Parameters.length,
  Get__Name: ($) => $.Internal.Name || 'anonymous',
  Apply: ($, This, Arguments) => Apply($.Internal, This, Arguments),
  Call: ($, This, ...Arguments) => Apply($.Internal, This, Arguments),
  Bind: ($, BoundToThis, ...Arguments) => MAKE_BOUND_FUNC($.Internal, BoundToThis, ...Arguments)
})

function FunctionConstructor($, Name, Params, Source, BoundTarget){
  $.Reflect = FunctionReflect;
  $.Value = MAKE_CODE(Name, Params, Source, BoundTarget);
}

