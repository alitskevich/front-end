<class> Object {

public:

  <new>(constructor: Function, proto: Object, initials: tuple[name, value])
  has(key: string):bool
  get(key: string):any
  set(key: string, value: any): Object
  keys(): string[]
  
members:

  proto: Object
  keys: Array
  values: Array
  
implementation:
	
  <new>(@, constructor, proto, initials)
 		
	@ := ALLOC()
	@constructor = constructor ? Object
	@proto = proto ? constructor.prototype

	if constructor is Object
		initials.each( e -> @set(e.name, e.value)
	else
		
		constructor(@, constructor, proto)
		
	return @ 

  has (key) 
    
    return @keys.includes(key)

  get (key) 

    return @has(key) ? @values(@keys.indexOf(key) : proto?.get(key)
  
  set (key, value) 
  
    if @has(key)
      
      values.replace(@keys.indexOf(key), value)
    
    else
    
      keys.add(key)
      values.add(value)
