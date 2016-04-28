const EMPTY_STR = {'': 1, '0': 1, 'false': 1, 'null': 1, 'undefined': 1};
import {resolveProp} from './JsxPropsResolver.es6';

export const SPECIAL_TAGS =['else','block','children'];

export const OPS = {
    'is': (a, b) => (a === b),
    'isnt': (a, b) => (a !== b)
}

export const ADAPTERS = {

    style(v, k, r){

        v = this::resolveProp(v);

        if (v === undefined) return;

        if (typeof v === 'object') {
            v = Object.keys(v).map((k)=> `${k}: ${v[k]}`).join(';')
        }

        r.style = v;
    }
    ,
    ['class'](v, k, r, isComponent){
        v = this::resolveProp(v);

        if (v === undefined) return;

        if (typeof v === 'object') {
            v = Object.keys(v).filter((key)=>(v[key] && !(v[key] in EMPTY_STR))).join(' ');
        }

        r['class'] = v;
    }
    ,
    click(v, k, r, isComponent){

        r[isComponent ? k : 'click'] = this.get(v.slice(1));
    },
    change(v, k, r, isComponent){

        v = this::resolveProp(v);

        if (v === undefined) return;

        r[isComponent ? k : 'change'] = v;
    },
    scroll(v, k, r, isComponent){

        v = this::resolveProp(v);

        if (v === undefined) return;

        r[isComponent ? k : 'scroll'] = v;
    }
    ,
    ["*"](v, k, r, isComponent){
        v = this::resolveProp(v);

        if (v === undefined) return;

        r[k] = v;
    }
};