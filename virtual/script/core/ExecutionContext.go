package js

var current *ExecutionContext

type (
	// ExecutionContext struct
	ExecutionContext struct {
		fn            *Function
		recievier     Ref
		VariableScope *VariableScope
		next          *ExecutionContext
	}

	// VariableScope struct
	VariableScope struct {
		data map[string]Ref
		next *VariableScope
	}
)

// CurrentExecutionContext return current context
func CurrentExecutionContext() *ExecutionContext {

	return current
}

// PopExecutionContext restore current context from current next
func PopExecutionContext() {

	current = current.next
}

// CreateAndPushExecutionContext creates a new one and set it as current context
func CreateAndPushExecutionContext(fn *Function, reciever Ref, arguments []Ref) (ctx *ExecutionContext, err Error) {

	if len(fn.parameters) + len(fn.variables) {

		var data = make(Hash)

		// define parameters and initialize them with arguments values in order of appearance
		for index, name := range fn.parameters {
			if _, hasDefined := data[key]; hasDefined {
				err = fmt.Format(`variable %s is already defined`, key)
			} else {
				data[key] = arguments[index]
			}
		}
		// define all variables BEFORE any execution, i.e. Hoisting
		for _, name := range fn.variables {
			if _, hasDefined := data[key]; hasDefined {
				err = fmt.Format(`variable %s is already defined`, key)
			} else {
				data[key] = Undefined
			}
		}
		// create a new variable scope enclosed by this function lexical scope
		scope := VariableScope{data, next: fn.LexicalScope}

	} else {

		// re-use current current scope
		scope := current.scope
	}

	ctx = &ExecutionContext{fn, recievier, scope, next: ExecutionStack.current}

	current = ctx

	return
}

// GetVar method
func GetVar(key string) (value Ref, err Error) {

  return current.scope.Get(key)
}

// AssignVar method
func AssignVar(key string, value Ref) (value Ref, err Error) {

  return current.scope.Assign(key, value)
}

// Get method
func (scope *VariableScope) Get(key string) (value Ref, err Error) {

	val, hasDefined := scope.data[key]

	switch {
	case hasDefined:
		value = val
	case scope.next:
		value = scope.next.Get(key)
	default:
		err = fmt.Format(`variable %s is not defined`, key)
	}

	return
}

// Assign method
func (scope *VariableScope) Assign(key string, value Ref) (value Ref, err Error) {

	oldValue, hasDefined := scope.data[key]

	switch {
	case hasDefined:
    Release(oldValue)
	  Retain(value)
	  scope.data[key] = value
	case scope.next:
		value = scope.next.Assign(key, value)
	default:
		err = fmt.Format(`variable %s is not defined`, key)
	}
}
