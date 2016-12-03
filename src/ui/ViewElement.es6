import {functionName, capitalize, getter, getStatic} from './utils.es6';

let COUNTER = 0;

export class Property {
    
    isEquals(){
        
        return a===b;
    }
    
    getter(state, key) {
        
        return getter(state, key)
    }
    
    setter(state, key, value) {
        
        state.put(key, value);
    }
}

const PROPERTY_STUB = new Property();

/**
 * The base component ancestor.
 */
export class Component {

    static PROPS = {
    
    }
    
    constructor(initialState, opts) {

        // unique identity
        this._id = functionName(this.constructor) + (++COUNTER);

        // the state
        this._state = { ...initialState };

        this.onConstructed(opts);
    }

    onConstructed() {
    
    }

    onInit() {

    }

    onDone() {

        this._id = null;

        this._state = null;
    }

    onInput(payload) {
        
        const diff = this.update(payload);
        
        if (diff) {
            
            this.applyChanges(diff);
            
        };
    }

    onError(error) {
  
    }

    applyChanges(diff) {
        
        this.render();
    }

    render() {
        
    }

    get(key) {
        
        const property = this.constructor.PROPS.get(key) || PROPERTY_STUB;

        return property.getter(this._state, key);
    }

    update(payload) {

        if (payload) {
            
            const diff = [];
            
            for (let property of this.constructor.PROPS.values()) {
              
                const key = prop.id;
                const value  = payload[key];
                const oldValue = this._state[key];
                if (!property.isEquals(value, )) {
                  diff.push({key, value, oldValue, property, hookId: key + 'Changed'});
                  property.setter(this._state, key, value, oldValue);
                }
            }
            if (diff.length) {
                
                diff.forEach(e => {
                    const hook = this.get(e.hookId) || this[e.hookId];
                    if (hook) {
                        
                        try {

                            hook.call(this, e.value, e);

                        } catch(ex){

                            this.onError({ ...ex, message: `Error in ${key} hook: ${ex.message}` });
                        }
                    }

                }); 
                return true;
                
            }

        }
        return false
    }

    /**
     * Gets string representation of component.
     */
    toString() {

        return this._id;
    }
}
