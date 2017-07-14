package core

type (

	// FunctionParam type
	FunctionParam struct {
		name     string
		typeName string
	}

	// FunctionCode type
	FunctionCode struct {
		source      Any
		impl        Native
		next        *Statement
		alternative *Statement
	}

  // Native type
	Native func(reciever Ref, arguments []Ref, ctx ExecutionContext)

	// Function type
	Function struct {
		Object

		name          string
		parameters    []FunctionParam
		boundReciever Ref
		code          *FunctionCode
		// to be parent for a new variable scope in Apply()
		lexicalScope *VariableScope
	}
)

var functionProto *Object = NewObject(Hash{

	Apply: func(reciever Ref, arguments []Ref) (resut Ref, err Error) {

		return ExecuteFunction(reciever, arguments)
	},

	Call: func(reciever Ref, arguments []Ref) (resut Ref, err Error) {

		return ExecuteFunction(reciever, arguments)
	},

	Bind: func(reciever Ref, arguments []Ref) *Function {
		return NewFunction{
			name:          `Bind[%s]`,
			parameters:    reciever.parameters,
			source:        reciever.code.source,
			boundReciever: arguments[0],
		}

	},
})

// NewFunction constructor
func NewFunction(name String, parameters []FunctionParam, reciever Ref, source Any) (fn *Function) {

	fn := &Function{
		typeCode:      TypeCodeFunction,
		next:          functionProto,
		name:          name,
		parameters:    parameters,
		code:          &FunctionCode{source},
		boundReciever: reciever,
		lexicalScope:  CurrentExecutionContext().scope,
	}

	// to be referred as prototype by each object that newly constructed with this function
	prototype := NewObject(&Hash{`constructor`: fn})
	fn.Set(`prototype`, prototype)

	return
}

// Execute method
func (fn *Function) Execute(reciever Ref, arguments []Ref) (result Ref, err Error) {

	// lazy translate source code into binary executable code
	err := ensureCodeIsTranslated(fn)
	if err {
		return
	}

	ctx := CurrentExecutionContext()

	for op := fn.code; op; {
			op, result, err := op.Execute(ctx)
			if err {
				return
			}
	}
	return
}

// ExecuteFunction method
func ExecuteFunction(fn Any, reciever Ref, arguments []Ref) (result Ref, err Error) {

	if fn.boundRecievier {
		recievier = fn.boundRecievier
	}

	// create a new execution context for this invocation
	// and push it into execution stack
	ctx := CreateAndPushExecutionContext(fn, reciever, arguments)
	defer PopExecutionContext()

	result, err := fn.Execute(reciever, arguments)

	return
}
