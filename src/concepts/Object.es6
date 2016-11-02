<class> Object {

public:

  <new>(proto: Object)
  get(key: string):any
  set(key: string, value: any): Object
  keys(): string[]
  
members:

  proto: Object
  keys: Array
  values: Array
  
implementation:
  
  index (key) 
    
    return @keys.indexOf(key)

  has (key) 
    
    return @keys.includes(key)

  get (key) 

    return @has(key) ? @values(index(key) : proto?.get(key)
  
  
  set (key, value) 
  
    if @has(key)
      
      values.replace(index(key), value)
    
    else
    
      keys.add(key)
      values.add(value)
}
