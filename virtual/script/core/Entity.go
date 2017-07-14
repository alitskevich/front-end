package core

type (

  // Any interface
  Any interface{}

  // Entity interface
  Entity interface {
    TypeOf() TypeCode
    ValueOf() Any
  }

  // Ref type
  Ref *Entity

  // Hash type
  Hash map[string]Ref

  // Array type
  Array []Ref

)
