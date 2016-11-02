<class> Array 

public:
  <new>(length:int)
  add(value: any)
  replace(index: int, value: any)
  includes(value: any): bool
  indexOf(value: any): int
  
members:

  length: int
  first: tuple[value, next]
  
implementation:

  next(stop, e = @first, reduce = (r,e) -> e, initial = 0, counter=0)
  
    return reduce( e?.next and !stop?(e, counter) ? @next(stop, e?.next, reduce, initial, counter + 1) : initial, e);

  add(value)
  
    @next().next := (value, null)
    
  indexOf(value)
  
    return @next(e -> e = value)?.value ? -1
     
  length()
  
    return @next(e -> e = value, NULL, (r, e) -> r + e, 0)
    
  replace(index, value)
  
    return @next((e, counter) -> index = counter).value := value
 
