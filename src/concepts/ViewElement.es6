import {functionName, capitalize, getter, getStatic} from './utils.es6';

let COUNTER = 0;

/**
 * The base component ancestor.
 */
export default class Component {

    static PROPS = {
    
    }
    
    constructor(initialState, opts) {

        // unique identity
        this._id = functionName(this.constructor) + (++COUNTER);

        // the state
        this._state = { ...initialState };

        this.onConstructed(opts);
    }

 
    ////////////////////////
    //// Lifecycle hooks
    ///////////////////////
   
    /**
     * Used by platform adapter to extend constructor logic
     */
    onConstructed() {
    
    }

    onInit() {

    }

    onDone() {

        this._id = null;

        this._state = null;
    }

    onUpdate(props, callback) {

        this.update(props, callback);
    }
    
    ////////////////////////
    //// State
    ///////////////////////

    get(key) {
        const PROP = this.constructor.PROPS[key];

        return PROP ? PROP.getter.call(this, this._state, key) : undefined;
    }

    update(delta) {

        if (delta) {

            const prevState = this._state;
            const keys = Object.keys(delta);

            for (let key in delta) {
              const PROP = this.constructor.PROPS[key];
              if (PROP && this.getOwnProperty(key) && PROP.isEquals(delta[key], this._state[key]))
 
                this.hook(`${key}Changed`, delta[key]);
              }

                    cb && cb();
                });

            } else {
                cb && cb();
            }

        }
    }

    hook(key, ...args) {

        const cb = this.get(key) || this[key + 'Changed'];

        try{

            return cb && cb.apply(this, args) || null;

        } catch(ex){

            this.logError(`Error in ${key} hook`, ex);
        }

    }

    ///////////////////////
    //// Routines
    ///////////////////////

    /**
     * Gets string representation of component.
     */
    toString() {

        return this._id;
    }
}
