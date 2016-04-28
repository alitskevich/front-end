import {functionName, getter, getStatic} from './utils/Utils.es6';
import {h, keye} from './jsx/JsxAdapter.es6';
import Pipes from './utils/Pipes.es6';

let COUNTER = 0;

/**
 * The component base.
 */
export default class Component {

    static addPipe = Pipes.add;

    constructor(props, opts) {

        Object.assign(this, opts);

        this._id = functionName(this.constructor) + (++COUNTER);

        this.props = {...getStatic(this, 'DEFAULTS'), ...props};

        this.state = {};

        this.jsx = this.constructor.$TEMPLATE || (this.constructor.$TEMPLATE=keye(this.render()));

        this.render = ()=> h.apply(this, this.jsx);

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
}