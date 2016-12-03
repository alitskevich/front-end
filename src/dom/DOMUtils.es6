const w3="http://www.w3.org/";
const DOMNamespaces = {
    html: w3+'1999/xhtml',
    mathml: w3+'1998/Math/MathML',
    svg: w3+'2000/svg'
};

const flagAttrs = {
    disabled: 'yes',
    selected: "true"
};

const instantAttrs = {
    value: 1
};

const addEventListener = window.addEventListener ? function(e,eventName, listener) {
    e.addEventListener(eventName, listener, false);
} : function(e,eventName, listener) {
    e.attachEvent("on" + eventName, listener);
};

export function findDOMElement(meta, parentElt, prevElt) {


    const placeholder = (prevElt ? prevElt.nextSibling : parentElt.firstChild) || null;

    let c = placeholder;

    for (;c &&!isMatched(c, meta);c = c.nextSibling);

    if (!c) {

        c = createDOMElement(meta, parentElt._namespaceURI);

        parentElt.insertBefore(c, placeholder);

    } else {

        applyDOMAttributes(c, meta.props);

        if (placeholder && c !== placeholder) {

            parentElt.insertBefore(c, placeholder);
        }
    }

    return c;
}

export function createDOMElement(meta, namespace) {

    let e = null;
    if (meta.type == '#text') {

        e = document.createTextNode(meta.props.text);

    } else {

        namespace = DOMNamespaces[meta.type] || namespace;

        if (namespace) {

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

    return e;
}

export function clearAfter(parent, c) {

    c = c ? c.nextSibling : parent.firstChild;

    while (c) {
        let t = c;
        c=c.nextSibling;
        parent.removeChild(t);
    }
}

function isMatched(e, meta) {

    return e.nodeName.toLowerCase() === meta.type.toLowerCase() && (!meta.props.$key || meta.props.$key===e.$key)
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

function setDOMAttribute(e, k, value) {
    if (k === '$key') {

        e.$key =  value;

    } else if (typeof value === 'function') {

        e.$listeners.push([k, value]);
        addEventListener(e, k, value);

    } else {

        if (flagAttrs[k]) {

            e[k] = value?true:null;

        } else if (instantAttrs[k]) {

            if (e[k] !== value){
                e[k] = value;
            }

        } else {

            if (e.getAttribute(k) != value) {
                e.setAttribute(k, value);
            }
        }
    }
}