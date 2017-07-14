package core

// TypeCode type
type TypeCode byte

const (

	// TypeCodeUndefined Undefined type code
	TypeCodeUndefined TypeCode = -1

	// TypeCodeNull code
	TypeCodeNull
	// TypeCodeZero code
	TypeCodeZero
	// TypeCodeFalse code
	TypeCodeFalse
	// TypeCodeNotANumber code
	TypeCodeNotANumber
	// TypeCodeEmptyString code
	TypeCodeEmptyString

	// TypeCodeTrue code
	TypeCodeTrue

	// TypeCodeNumber code
	TypeCodeNumber
	// TypeCodeString code
	TypeCodeString
	// TypeCodeSymbol code
	TypeCodeSymbol

	// TypeCodeObject code
	TypeCodeObject
	// TypeCodeFunction code
	TypeCodeFunction
)
