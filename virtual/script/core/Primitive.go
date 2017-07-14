package core

// Primitive type
type Primitive struct {
	typeCode TypeCode
	value    Any
}

// TypeOf method
func (p *Primitive) TypeOf() TypeCode {

	return p.typeCode
}

// ValueOf method
func (p *Primitive) ValueOf() Any {

	return p.value
}


// Undefined singletone instance
var Undefined = &Primitive{TypeCodeUndefined}

// Null singletone instance
var Null = &Primitive{TypeCodeNull}

// False singletone instance
var False = &Primitive{TypeCodeFalse}

// True singletone instance
var True = &Primitive{TypeCodeTrue}

// NaN singletone instance
var NaN = &Primitive{TypeCodeNotANumber}

// EmptyString singletone instance
var EmptyString = &Primitive{TypeCodeEmptyString}

// Zero singletone instance
var Zero = &Primitive{TypeCodeZero}
