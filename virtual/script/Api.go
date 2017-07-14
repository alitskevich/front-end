package js

// CreateObject utility
func CreateObject(next Ref) (o *Object) {

  o := &Object{ next }

  return
}

// TypeOf func
func TypeOf(any Ref) (typeName string) {

	return TYPE_NAMES[any.Type()]
}
// ValueOf func
func ValueOf(any Ref) (value Ref, err Error) {

	switch any.Type() {

	 case TYPE_UNDEFINED:

	}
}

// Get func
func Get(any Ref, key string) (value Ref, err Error) {

	switch this.typeId {
  	case TYPE_UNDEFINED:
  	case TYPE_NULL:
  	case TYPE_OBJECT:
  		value, err = any.(Object).Set(key, value)

	}
  return
}

// Set func
func Set(any Ref, key string, value Ref) (value Ref, err Error) {

	switch this.typeId {
  	case TYPE_UNDEFINED:
  	case TYPE_NULL:
  	case TYPE_OBJECT:
  		value, err = any.(Object).Set(key, value)

	}
  return
}
