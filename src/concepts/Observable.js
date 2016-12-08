

/**
 * Observable - No event types, 1-to-N keep all observers by itself.
 */
export default class Observable {

    constructor(){

        this.observers = new Set();
    }

    addObserver(o) {
 
        this.observers.add(o);
    }

    removeObserver(o) {

        this.observers.delete(o);
    }

    forEach(fn) {
        
        this.observers.forEach(fn);
    }
    
    notify(event) {
        
        this.forEach(o=>o(event));
    }
    
}