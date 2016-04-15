import Component from './Component.es6';

import {findDOMElement, applyDOMAttributes, clearTrailing} from './utils/DOMUtils.es6';

Component.prototype.invalidate = function () {

    render(this);
}

export function bootstrap(rootComponentClass, props, parentElt) {

    render(new rootComponentClass(props, {parentElt}));
}

export function render(c) {

    c::apply(c.render(), {parentElt: c.parentElt, alreadyUsedElt: c.alreadyUsedElt});
}

function apply(meta, context) {

    const parentElt = context.parentElt;

    if (typeof meta.type === 'function') {

        const c = new meta.type(meta.props, {parentElt});

        c::apply(c.render(), context);

    } else {

        const element = this::resolveDomElement(meta, context);

        const children = meta.children;
        const ctx = {parentElt: element};
        if (children) {
            const c = {};
            children.map(m=>c::apply(m, ctx));
        }
        clearTrailing(ctx);
    }
}

function resolveDomElement(meta, context) {

    if (context.alreadyUsedElt) {

        return applyDOMAttributes(context.alreadyUsedElt, meta.props)

    } else {

        return this.alreadyUsedElt = findDOMElement(meta, context);
    }
}