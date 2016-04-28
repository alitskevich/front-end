import Component from './Component.es6';

import {findDOMElement, clearAfter} from './utils/DOMUtils.es6';

Component.prototype.invalidate = function () {

    this.element = this::redraw(this.render(), this.parentElt, this.prevElt);
}

export function bootstrap(rootType, props, parentElt) {

    const root = new rootType(props, {parentElt});

    root.invalidate();

    root.init && root.init();

    return root;
}

function redraw(meta, parentElt, prevElt) {

    let element = null;

    if (typeof meta.type === 'function') {

        const key = meta.props.$key;

        let c = this.subs && this.subs[key];
        let isNew=false;
        if (c){

            c.parentElt = parentElt;
            c.prevElt = prevElt;

            c.updateProps(meta.props);

        } else {
            c = (this.subs || (this.subs={}))[key] = new meta.type(meta.props, {parentElt, prevElt})
            isNew=true;
        }

        (this.retainedSubs||(this.retainedSubs={}))[key]=c;

        c.retainedSubs={};
        element = c.element = c::redraw(c.render(), parentElt, prevElt);
        if (c.subs){
            c.subs = Object.keys(c.subs).reduce((subs,key)=>{
                const sub= c.subs[key];
                if (c.retainedSubs[key]){
                    subs[key] = sub;
                } else {
                    sub.done && sub.done();
                }
                return subs;
            },{});
        }


        if (isNew){
            c.init && c.init();
        }

    } else {

        element = findDOMElement(meta, parentElt, prevElt);

        const lastChildElt = meta.children && meta.children.reduce((cursor,meta)=>this::redraw(meta, element, cursor), null);

        clearAfter(element, lastChildElt);

    }

    return element;
}