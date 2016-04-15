import {functionName, getter, getStatic} from './utils/Utils.es6';
import {h} from './jsx/JsxAdapter.es6';

let COUNTER = 0;
const PIPES = {};

/**
 * The component base.
 */
export default class Component {

    static addPipe = function (k, v) {
        PIPES[k] = v
    };

    constructor(props, opts) {

        Object.assign(this, opts);

        this._id = functionName(this.constructor) + (++COUNTER);

        this.state = {...getStatic(this, 'DEFAULTS'), ...props};

        this.jsx = this.render();

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

        return getter.call(this.state, key);
    }

    set(key, value, cb) {

        this.update({[key]: value}, cb);
    }

    update(delta) {

        if (delta) {

            const changedKeys = Object.keys(delta).filter(key=>(this.state[key] !== delta[key]));

            if (changedKeys.length) {

                Object.assign(this.state, delta);

                this.invalidate();

                changedKeys.forEach(key=>this.hook(`${key}Changed`, delta[key]));
            }
        }
    }

    ////////////////////////
    //// Routines
    ///////////////////////

    getUpdateOnClick() {

        return (ev)=> this.update({...ev.currentTarget.dataset});
    }

    hook(key, ...args) {

        const cb = this.state[key];

        return cb && cb.apply(this, args) || null;
    }

    pipe(value, pipes) {

        if (typeof pipes==='string'){
            pipes = pipes.split('|');
        }
        return pipes.map(p => p.trim()).filter(p=>PIPES[p]).reduce((value, p)=>PIPES[p](value), value)
    }

    log(message, ...data) {

        console.log(this.toString(), message, ...data);

        return message;
    }

    toString() {

        return this._id;
    }
}