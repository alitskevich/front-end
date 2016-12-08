export const Undefined = {};

export const Null = {};

export const NotNumber = {};

class Func extends Obj {
  
  static TYPEOF = 'function';
  
  constructor(lexicalScope, params, code, context) {

    this.prototype = {};
    
    this.$closure = lexicalScope;
    
    this.$context = context;
    this.$params = params;
    this.$code = code;
  }
      
  apply(context, args) {
    
    if (!this.$body) {
      
      const compiled = COMPILE(this.code)
      this.$body = compiled.body;
      this.$vars = compiled.vars;
    }
    
    const scope =  Object.create(this.$closure);
    scope.set('arguments', args);
    scope.set('this', this.$context || context);
    
    this.$params.forEach((param, index) => scope.set(param.name, args[index]));
    this.$vars.forEach((v) => scope.set(v.name, UNDEFINED));
    
    EVAL(scope, this.$body);

  }
      
  call(context, ...args) {
    
    this.apply(context, args)
  }
    
}
export default function createObject(_prototype) {
    
    const _this = alloc();
  	
  	_this.constructor = _Object;
  	
  	_this.__proto__ = _prototype;

    return _this;
}

export function newInstance(_constructor, _args) {
    
    const _this = alloc();
  	
  	_this.constructor = _constructor;
  	
  	_this.__proto__ = _this.constructor.prototype;
  		
  	_this.constructor.apply(_this, _args)

    return _this;
}

const _Object = ()  => {}

_Object.prototype = {
 
  has(key) {
      
      return this.$keys.includes(key);
  },

  get: (key) => {
    
    const index = $.__keys.indexOf(key);
    
    if (index === -1) {
      
       return $.__proto ? $.__proto.get(key) : Undefined;
    }
    
    return $.__values[index] : 
  }
  
  set (key, value) {
  
    if @has(key)
      
      values.replace(@keys.indexOf(key), value)
    
    else
    
      keys.add(key)
      values.add(value)
  } 
}