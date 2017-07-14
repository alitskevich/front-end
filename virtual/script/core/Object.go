package js

type (

	// Object struct
	Object struct {
		typeCode    TypeCode
		next        *Object
		data        Hash
    meta        ObjectMeta
		retainCount int
	}

	// ObjectMeta type
	ObjectMeta map[String]*ObjectPropertyDescriptor

	// ObjectPropertyDescriptor type
	ObjectPropertyDescriptor struct {
		Getter         *Function
		Setter         *Function
		IsReadOnly     bool
		IsEnumerable   bool
		IsConfigurable bool
		Value          Ref
	}
)

// NewObject utility
func NewObject(next Ref, data Hash) (o *Object){

  o := &Object{
    TypeCodeObject,
    next,
    data: data,
  };

  if next {
    o.DefineProperty("__proto__", protoPropertyDescriptor)
  }

  return
}

// TypeOf method
func (o *Object) TypeOf() TypeCode {

	return o.typeCode
}

// ValueOf method
func (o *Object) ValueOf() Any {

	return o
}

// Retain method
func (o *Object) Retain() {

	o.retainCount++
}

// Release method
func (o *Object) Release() {

	o.retainCount--
  if !o.retainCount {
    o.Destroy()
  }
}

// Destroy method
func (o *Object) Destroy() {
}

// HasOwnProperty method
func (o *Object) HasOwnProperty(key string) (hasOwn bool) {

	if o.data {
		_, hasOwn := o.data[key]
	}

	return
}

// PrototypeOf method
func (o *Object) PrototypeOf() *Object {

	return o.proto
}

// ToString method
func (o *Object) ToString() {

  return `Object{}`
}

// LookupPropertyDescriptor method
func (o *Object) LookupPropertyDescriptor(key string) (prop PropertyDescriptor) {

	if o.meta {

		prop, hasOwn := o.meta[key]
	}

	// use Proto if no own
	if !hasOwn && o.proto {

		prop = o.Proto.LookupPropertyDescriptor(key)
	}

	return
}

// DefineProperty routine
func (o *Object) DefineProperty(key string, prop ObjectPropertyDescriptor) (prop PropertyDescriptor, err Error) {

	const p = o.LookupPropertyDescriptor(key)

	if p && !p.IsConfigurable {

		err = fmt.Format(`Property %s is already defined`, key)

	} else {

		if !o.meta {
			o.meta = ObjectMeta{}
		}

		o.meta[key] = prop
	}

	return
}

// Get method
func (o *Object) Get(key string) (value Ref) {

	prop := LookupPropertyDescriptor(key)

	switch {
	case prop && prop.Get:
		value = prop.Get.Call(o, key)
	case prop && prop.Value:
		value = prop.Value
	case o.HasOwnProperty(key):
		value = o.data[key]
	case o.proto:
		value = o.proto.Get(key)
	default:
		value = Undefined
	}

	return
}

// Set method
func (o *Object) Set(key string, value Ref) (value Ref, err Error) {

	prop := LookupPropertyDescriptor(key)

	switch {
	case prop && prop.isReadonly:
		err = `property '${key}' is read only`
	case prop && prop.Set:
		value = prop.Set.Call(o, key, value)
	default:
		if !o.data {
			o.data = &Hash{}
		}
		o.data[key] = value
	}

	return
}

// NewObjectPropertyDescriptor constructor
func NewObjectPropertyDescriptor(
	IsEnumerable Ref,
	IsConfigurable Ref,
	Value Ref,
	Getter *Function,
	Setter *Function) (prop PropertyDescriptor, err Error) {

	IsReadOnly = Value || (Getter && !Setter)
	IsEnumerable = IsEnumerable != False
	IsConfigurable = IsConfigurable != False

	prop = &ObjectPropertyDescriptor{Getter, Setter, IsReadOnly, IsEnumerable, IsConfigurable, Value}

	return
}

var protoPropertyDescriptor = &ObjectPropertyDescriptor{
  Getter: func (o *Object, key string) {
    return o.next
  },
  Setter: func (o *Object, key string, value Ref) {
    o.next = value
  },
}

// ObjectRoot instance
var ObjectRoot = createRoot()

func createRoot() (root *Object){

  root = &Object{};

  root.Set(`constructor`, 
    &Function{
      source:func (reciever *Object, arguments []Ref) Any {
      },
    },
  );

  root.Set(`hasOwnProperty`,
    &Function{
      source:func (reciever *Object, arguments []Ref) Any {
        return reciever.HasOwnProperty(arguments[0])
      },
    },
  )

  return

}
