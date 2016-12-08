import {functionName, getter, getStatic} from './utils/Utils.es6';
import {h, keye} from './jsx/JsxAdapter.es6';
import Pipes from './utils/Pipes.es6';
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
    
    static addPipe = Pipes.add;

    constructor(initialState, opts) {

        Object.assign(this, opts);

        this._id = functionName(this.constructor) + (++COUNTER);

        this.props = {...getStatic(this, 'DEFAULTS'), ...props};

        this.state = {};

        this.jsx = this.constructor.$TEMPLATE || (this.constructor.$TEMPLATE=keye(this.render()));

        this.render = ()=> h.apply(this, this.jsx);
        
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


    render() {

        return getStatic(this, 'TEMPLATE');
    }

    invalidate() {
    }

    ////////////////////////
    //// State
    ///////////////////////

    get(key) {

        // try Getter
        let value = this['get' + key[0].toUpperCase() + key.slice(1)];
        if (value !== undefined) {

            return value.call(this);
        }

        value = this.$ && this.$[key];
        if (value !== undefined) {

            return value;
        }

        value = this[key];
        if (value !== undefined && value.bind) {

            return (this.$ ||(this.$={}))[key] = value.bind(this);
        }

        return this.getState(key);
    }   
    
    getState(key) {

        let value =  getter.call(this.state, key);
        if (value !== undefined) {

            return value;
        }

        return getter.call(this.props, key);
    }

    set(key, value, cb) {

        this.update({[key]: value}, cb);
    }

    update(delta) {

        if (delta) {

            const changedKeys = Object.keys(delta).filter(key=>(this.getState(key) !== delta[key]));

            if (changedKeys.length) {

                //this.log('update', changedKeys);

                Object.assign(this.state, delta);

                this.invalidate();

                changedKeys.forEach(key=>this.hook(`${key}Changed`, delta[key]));
            }
        }
    }

    updateProps(delta) {

        if (delta) {

            const changedKeys = Object.keys(delta).filter(key=>(this.getState(key) !== delta[key]));

            if (changedKeys.length) {

                //this.log('updateProps', changedKeys);

                changedKeys.forEach(key=>{
                    this.props[key] = delta[key];
                    delete this.state[key]
                });


                this.didUpdatedProps(this.props, delta)
            }
        }
    }


    didUpdatedProps(props, delta){
    }
    ////////////////////////
    //// Routines
    ///////////////////////

    updateOnClick(ev){

        this.update({...ev.currentTarget.dataset});
    }

    hook(key, ...args) {

        const cb = this.props[key];

        return cb && cb.apply(this, args) || null;
    }

    pipe(value, pipes) {

        return Pipes.apply(value, pipes);
    }

    log(message, ...data) {

        console.log(this.toString(), message, ...data);

        return message;
    }

    toString() {

        return this._id;
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
              
                const key = property.id;
                const value  = payload[key];
                const oldValue = this._state[key];
                if (!property.isEquals(value, oldValue)) {
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
