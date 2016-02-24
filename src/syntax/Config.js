const value = "value";

const object = {
  key: value,
  key1: true,
  key2: false
}


const CONSTS = {
  object,
    
  array : [1,2,3,4],
    
    myString: "Hello world!",
    
    myFunc: function(){
        return this.myString;
    }
};

export default Object.assign({a:1}, CONSTS);
