const DOMNamespaces = {
    html: 'http://www.w3.org/1999/xhtml',
    mathml: 'http://www.w3.org/1998/Math/MathML',
    svg: 'http://www.w3.org/2000/svg'
};

const flagAttrs = {
    disabled: 'yes',
    selected: "true"
}

export function setDOMAttribute(e, k, value) {
    if (typeof value === 'function') {
        e.$listeners.push([k, value]);
        e.addEventListener(k, value, false);
    } else {

        if (flagAttrs[k]) {

            e[k] = value ? true : null;

        } else {

            if (e.getAttribute(k) != value) {
                e.setAttribute(k, value);
            }
        }
    }
}


export function applyDOMAttributes(e, props) {
    if (props) {
        if (e.nodeName == '#text') {
            if (e.textContent !== props.text) {
                e.textContent = props.text;
            }
        } else {

            for (let i = 0, l = e.attributes.length; i < l; i++) {
                let attr = e.attributes.item(0);
                if (!props[attr.name]) {
                    e.removeAttribute(attr);
                }
            }
            e.$listeners && e.$listeners.forEach(kv=>e.removeEventListener(...kv));
            e.$listeners = [];
            Object.keys(props).map(k => setDOMAttribute(e, k, props[k]));
        }
    }
    return e;
}

export function isMatched(cursor, meta) {

    return cursor.nodeName.toUpperCase() === meta.type.toUpperCase()
}

export function selectDOMElement(meta, ctx) {

    const parentElt = ctx.parentElt;

    let cursor = ctx.cursor ? ctx.cursor.nextSibling : parentElt.firstChild;

    while (cursor) {

        if (isMatched(cursor, meta)) {
            return cursor;
        }
        cursor = cursor.nextSibling;
    }
    return null;
}

export function findDOMElement(meta, ctx) {


    const parentElt = ctx.parentElt;

    let cursor = selectDOMElement(meta, ctx);

    if (!cursor) {
        cursor = createDOMElement(meta, ctx);
    } else {

        applyDOMAttributes(cursor, meta.props);

        let trash = ctx.cursor ? ctx.cursor.nextSibling : parentElt.firstChild;
        while (trash && cursor !== trash) {
            let t = trash;
            trash = trash.nextSibling;
            parentElt.removeChild(t);
        }
    }

    return ctx.cursor = cursor;
}

export function clearTrailing(ctx) {
    let cursor = ctx.cursor ? ctx.cursor.nextSibling : ctx.parentElt.firstChild;
    while (cursor) {
        let t = cursor;
        cursor = cursor.nextSibling;
        ctx.parentElt.removeChild(t);
    }
}

export function createDOMElement(meta, ctx) {

    let e = null;
    if (meta.type == '#text') {

        e = document.createTextNode(meta.props.text);

    } else {

        let namespace = (meta.type === 'svg') ? DOMNamespaces.svg : ctx.parentElt._namespaceURI;

        if (namespace === DOMNamespaces.svg) {

            e = document.createElementNS(namespace, meta.type);

            e._namespaceURI = namespace;

        } else {

            e = document.createElement(meta.type);

        }

        const props = meta.props;
        if (props) {

            e.$listeners = [];

            Object.keys(props).map(k => setDOMAttribute(e, k, props[k]));
        }


    }

    const before = (ctx.cursor ? ctx.cursor.nextSibling : ctx.parentElt.firstChild) || null;

    ctx.parentElt.insertBefore(e, before);

    return e;
}