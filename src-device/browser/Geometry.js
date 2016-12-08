class Figure {
    
    constructor() {
        
        
    }
}

class Animal {
    
    constructor(age) {
        
        this.age = age;
    }
      
    eat() {
        
    }
    
    sleep() {
        
    }  
}

class Person extends Animal {
    
    constructor(age, clever) {
        
        super(age);
        
        this.clever = clever;
    }
    
    think(){
        
    }
}

class Woman extends Person {
    
    constructor(age, clever, speed) {
        
        super(age, clever);
        
        this.speed = speed;
    }
    
    born(params) {
        
       return new Hero(params);
    }
}

class Hero extends Person {
    
    constructor(age, clever, speed) {
        
        super(age, clever);
        
        this.speed = speed;
    }
    
    fly() {
        
    }
}

function bigbang() {
 
    const alex = new Person();
     
    const inna = new Woman();
    
    const danila = inna.born(16, 200, 345);
    
    danila.fly()
    danila.eat()
    danila.think();
}

bigbang();