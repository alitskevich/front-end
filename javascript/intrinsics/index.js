/**
 * Intrinsics are built-in low-level code routines.
 * Most of them are used to construct properties of Global object
 */
const ConstructorsNames = [
  'Array',
  'ArrayBuffer',
  'Boolean',
  'DataView',
  'Date',
  'Error',
  'EvalError',
  'Float32Array',
  'Float64Array',
  'Function',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'Map',
  'Number',
  'Object',
  'Proxy',
  'Promise',
  'RangeError',
  'ReferenceError',
  'RegExp',
  'Set',
  'SharedArrayBuffer',
  'String',
  'Symbol',
  'SyntaxError',
  'TypeError',
  'Uint8Array',
  'Uint8ClampedArray',
  'Uint16Array',
  'Uint32Array',
  'URIError',
  'WeakMap',
  'WeakSet'
];
export default {
  //The Reflect object
  Reflect: REFLECT,
  // The eval function (18.2.1)
  Eval,
  // The isFinite function (18.2.2)
  isFinite,
  // The isNaN function (18.2.3)
  isNaN,
  // 	parseFloat	The parseFloat function (18.2.4)
  parseFloat,
  // 	parseInt	The parseInt function (18.2.5)
  parseInt,
  // 	decodeURI	The decodeURI function (18.2.6.2)
  decodeURI,
  // 	decodeURIComponent	The  decodeURIComponent function (18.2.6.3)
  decodeURIComponent,
  // 	encodeURI	The encodeURI function (18.2.6.4)
  encodeURI,
  // 	encodeURIComponent	The  encodeURIComponent function (18.2.6.5)
  encodeURIComponent,
  //
  // // 	Promise	The Promise constructor (25.4.3)
  // PromiseConstructor,
  // // 	Promise.prototype	The initial value of the  prototype data property of %Promise%
  // PromisePrototype,
  //
  // // 	Proxy	The Proxy constructor (26.2.1)
  // ProxyConstructor,
  //
  // 		The Object constructor (19.1.1)
  ObjectConstructor,
  // 	Object.prototype	The initial value of the  prototype data property of %Object%. (19.1.3)
  ObjectPrototype,
  // // 	Object.prototype.toString	The initial value of the  toString data property of %ObjectPrototype% (19.1.3.6)
  // ObjProto_toString,
  // // 	Object.prototype.valueOf	The initial value of the  valueOf data property of %ObjectPrototype% (19.1.3.7)
  // ObjProto_valueOf,
  //
  // // 	Array	The Array constructor (22.1.1)
  // ArrayConstructor,
  // // 	Array.prototype	The initial value of the  prototype data property of %Array% (22.1.3)
  // ArrayPrototype,
  // // 	Array.prototype.values	The initial value of the  values data property of %ArrayPrototype% (22.1.3.30)
  // ArrayProto_values,
  // // 		The prototype of Array iterator objects (22.1.5)
  // ArrayIteratorPrototype,
  // // 		An object that all standard built-in iterator objects indirectly inherit from
  // IteratorPrototype,

  // 	Function	The Function constructor (19.2.1)
  FunctionConstructor,
  // 	Function.prototype	The initial value of the  prototype data property of %Function%
  FunctionPrototype,

  // // 		The initial value of the  prototype property of %GeneratorFunction%
  // GeneratorConstructor,
  // // 		The constructor of generator objects (25.2.1)
  // GeneratorFunction,
  // // 		The initial value of the  prototype property of %Generator%
  // GeneratorPrototype,
  //
  // // 		The constructor of async function objects (25.5.1)
  // AsyncFunction,
  // // 		The initial value of the  prototype data property of %AsyncFunction%
  // AsyncFunctionPrototype,

  // // 	Boolean	The Boolean constructor (19.3.1)
  // BooleanConstructor,
  // // 	Boolean.prototype	The initial value of the  prototype data property of %Boolean% (19.3.3)
  // BooleanPrototype,
  //
  // // 	Date	The Date constructor (20.3.2)
  // DateConstructor,
  // // 	Date.prototype	The initial value of the  prototype data property of %Date%.
  // DatePrototype,
  //
  NumberConstructor, NumberPrototype,

  // // 	String	The String constructor (21.1.1)
  // StringConstructor,
  // // 		The prototype of String iterator objects (21.1.5)
  // StringIteratorPrototype,
  // // 	String.prototype	The initial value of the  prototype data property of %String%
  // StringPrototype,
  //
  // // 	RegExp	The RegExp constructor (21.2.3)
  // RegExpConstructor,
  // // 	RegExp.prototype	The initial value of the  prototype data property of %RegExp%
  // RegExpPrototype,
  //
  // // 	Symbol	The Symbol constructor (19.4.1)
  // SymbolConstructor,
  // // 	Symbol.prototype	The initial value of the  prototype data property of %Symbol%. (19.4.3)
  // SymbolPrototype,
  //
  //
  // // 	Map	The Map constructor (23.1.1)
  // MapConstructor,
  // // 		The prototype of Map iterator objects (23.1.5)
  // MapIteratorPrototype,
  // // 	Map.prototype	The initial value of the  prototype data property of %Map%
  // MapPrototype,
  // // 	Set	The Set constructor (23.2.1)
  // SetConstructor,
  // // 		The prototype of Set iterator objects (23.2.5)
  // SetIteratorPrototype,
  // // 	Set.prototype	The initial value of the  prototype data property of %Set%
  // SetPrototype,
  // // 	WeakMap	The WeakMap constructor (23.3.1)
  // WeakMapConstructor,
  // // 	WeakMap.prototype	The initial value of the  prototype data property of %WeakMap%
  // WeakMapPrototype,
  // // 	WeakSet	The WeakSet constructor (23.4.1)
  // WeakSetConstructor,
  // // 	WeakSet.prototype	The initial value of the  prototype data property of %WeakSet%
  // WeakSetPrototype,
  //
  // // 	Math	The MathObject
  // Math,
  // // 	JSON	The JSON object (24.5)
  // JSON,
  //

  // // 	Error	The Error constructor (19.5.1)
  // ErrorConstructor,
  // // 	Error.prototype	The initial value of the  prototype data property of %Error%
  // ErrorPrototype,
  // // 	SyntaxError	The SyntaxError constructor (19.5.5.4)
  // SyntaxErrorConstructor,
  // // 	SyntaxError.prototype	The initial value of the  prototype property of %SyntaxError%
  // SyntaxErrorPrototype,
  // // 		A function object that unconditionally throws a new instance of %TypeError%
  // ThrowTypeErrorConstructor,
  // // 	TypeError	The TypeError constructor (19.5.5.5)
  // TypeErrorConstructor,
  // // 	TypeError.prototype	The initial value of the  prototype property of %TypeError%
  // TypeErrorPrototype,
  // // 	URIError	The URIError constructor (19.5.5.6)
  // URIErrorConstructor,
  // // 	URIError.prototype	The initial value of the  prototype property of %URIError%
  // URIErrorPrototype,
  // // 	EvalError	The EvalError constructor (19.5.5.1)
  // EvalErrorConstructor,
  // // 	EvalError.prototype	The initial value of the  prototype property of %EvalError%
  // EvalErrorPrototype,
  // // 	RangeError	The RangeError constructor (19.5.5.2)
  // RangeErrorConstructor,
  // // 	RangeError.prototype	The initial value of the  prototype property of %RangeError%
  // RangeErrorPrototype,
  // // 	ReferenceError	The ReferenceError constructor (19.5.5.3)
  // ReferenceErrorConstructor,
  // // 	ReferenceError.prototype	The initial value of the  prototype property of %ReferenceError%
  // ReferenceErrorPrototype,

  // // 	ArrayBuffer	The ArrayBuffer constructor (24.1.2)
  // ArrayBufferConstructor,
  // // 	ArrayBuffer.prototype	The initial value of the  prototype data property of %ArrayBuffer%.
  // ArrayBufferPrototype,
  // // 	SharedArrayBuffer	The SharedArrayBuffer constructor (24.2.2)
  // SharedArrayBufferConstructor,
  // // 	SharedArrayBuffer.prototype	The initial value of the  prototype data property of %SharedArrayBuffer%.
  // SharedArrayBufferPrototype,
  // // 	Atomics	The Atomics object (24.4)
  // Atomics,
  // // 	DataView	The DataView constructor (24.3.2)
  // DataViewConstructor,
  // // 	DataView.prototype	The initial value of the  prototype data property of %DataView%
  // DataViewPrototype,
  // // 		The super class of all typed Array constructors (22.2.1)
  // TypedArrayConstructor,
  // // 		The initial value of the  prototype property of %TypedArray%
  // TypedArrayPrototype,
  // // 	Int8Array	The Int8Array constructor (22.2)
  // Int8ArrayConstructor,
  // // 	Int8Array.prototype	The initial value of the  prototype data property of %Int8Array%
  // Int8ArrayPrototype,
  // // 	Int16Array	The Int16Array constructor (22.2)
  // Int16ArrayConstructor,
  // // 	Int16Array.prototype	The initial value of the  prototype data property of %Int16Array%
  // Int16ArrayPrototype,
  // // 	Int32Array	The Int32Array constructor (22.2)
  // Int32ArrayConstructor,
  // // 	Int32Array.prototype	The initial value of the  prototype data property of %Int32Array%
  // Int32ArrayPrototype,
  // // 	Uint8Array	The Uint8Array constructor (22.2)
  // Uint8ArrayConstructor,
  // // 	Uint8Array.prototype	The initial value of the  prototype data property of %Uint8Array%
  // Uint8ArrayPrototype,
  // // 	Uint8ClampedArray	The Uint8ClampedArray constructor (22.2)
  // Uint8ClampedArrayConstructor,
  // // 	Uint8ClampedArray.prototype	The initial value of the  prototype data property of %Uint8ClampedArray%
  // Uint8ClampedArrayPrototype,
  // // 	Uint16Array	The Uint16Array constructor (22.2)
  // Uint16ArrayConstructor,
  // // 	Uint16Array.prototype	The initial value of the  prototype data property of %Uint16Array%
  // Uint16ArrayPrototype,
  // // 	Uint32Array	The Uint32Array constructor (22.2)
  // Uint32ArrayConstructor,
  // // 	Uint32Array.prototype	The initial value of the  prototype data property of %Uint32Array%
  // Uint32ArrayPrototype,
  // // 	Float32Array	The Float32Array constructor (22.2)
  // Float32ArrayConstructor,
  // // 	Float32Array.prototype	The initial value of the  prototype data property of %Float32Array%.
  // Float32ArrayPrototype,
  // // 	Float64Array	The Float64Array constructor (22.2)
  // Float64ArrayConstructor,
  // // 	Float64Array.prototype	The initial value of the  prototype data property of %Float64Array%
  // Float64ArrayPrototype
}

function CreateGlobalObject(Realm) {

  const { Intrinsics, HostDefined } = Realm;

  function createConst(Value) {
    return {
      Value,
      Writable: FALSE,
      Configurable: FALSE,
      Enumerable: FALSE,
    }
  }

  function createFunction(Code) {
    return MakeFunction({ Code })
  }

  function createConstructor(Name) {
    return MakeFunction({
      Name,
      Prototype: MakeObject(Intrinsics[ `${Name}Prototype` ]),
      Code: Intrinsics[ `${Name}Constructor` ]
    })
  }

  const Constructors = ConstructorsNames.reduce((r, Name) => {
    r[ Name ] = createConstructor(Name);
    return r;
  }, {});

  const Eval = (source) => {

    const fn = MakeInternalFunction({});
  
    translate(fn, 'return ' + source);
  
    return Apply(fn);
  };
  const GlobalObject = {

    // Non-equal to anything including itself
    // NaN: createConst(Intrinsics.NaN),
    // // More then any other number
    // Infinity: createConst(Intrinsics.Infinity),
    // // Undefined
    // undefined: createConst(Intrinsics.UNDEFINED),
    // // Undefined
    // ['null']: createConst(Intrinsics.NULL),
    //
    // // Global functions:
    // eval: createFunction(Intrinsics.Eval),
    //
    // isNan: createFunction(Intrinsics.isNan),
    // isFinite: createFunction(Intrinsics.isFinite),
    //
    // parseFloat: createFunction(Intrinsics.parseFloat),
    // parseInt: createFunction(Intrinsics.parseInt),
    //
    // encode: createFunction(Intrinsics.encode),
    // decode: createFunction(Intrinsics.decode),
    //
    // encodeURIComponent: createFunction(Intrinsics.encodeURIComponent),
    // decodeURIComponent: createFunction(Intrinsics.decodeURIComponent),

    // // Global objects:
    // Atomics: MakeObject(Intrinsics.Atomics),
    // JSON: MakeObject(Intrinsics.JSON),
    // Math: MakeObject(Intrinsics.Math),
    Reflect: MakeObject(Intrinsics.Reflect),

    ...Constructors,

    ...HostDefined
  };

  Realm.GlobalObject = GlobalObject;

  return GlobalObject;

}