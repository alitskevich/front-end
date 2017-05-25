/* eslint no-eq-null: "off" */
/* eslint eqeqeq: "off" */
const w3 = 'http://www.w3.org/';

const DOMNamespaces = {
    html: w3 + '1999/xhtml',
    mathml: w3 + '1998/Math/MathML',
    svg: w3 + '2000/svg'
};

const flagAttrs = {
    disabled: 'yes',
    selected: 'true'
};

const instantAttrs = {
    value: 1,
    checked: 1
};

const win = typeof window === 'undefined' ? {} : window;

const parsePrimitive = function (v) {

  if (v === 'null') {
      return null;
  } else if (v === 'undefined') {
      return Object.undefined;
  } else if (v === 'true') {
      return true;
  } else if (v === 'false') {
      return false;
  }

  const n = +v;
  if (!isNaN(n)) {
    return n;
  }

  return v;
};

function objForEach(x, fn) {

  if (x && fn) {
    Object.keys(x).forEach((key, index) => fn(x[ key ], key, index));
  }

  return x;
}

export function parseDataset(dataset) {
  return Object.keys(dataset).reduce(( r, key) => {
    r[key] = parsePrimitive(dataset[key]);
    return r;
  }, {});
}

export const addEventListener = win.addEventListener ?
   (e, eventName, listener) => e.addEventListener(eventName, listener, false) :
   (e, eventName, listener) => e.attachEvent('on' + eventName, listener);

export function appendDOMElement(element, parentNode, nextSibling) {
  if (nextSibling) {
    parentNode.insertBefore(element, nextSibling);
  } else {
    parentNode.appendChild(element);
  }
}

export function createDomElement(tag, _namespace) {

  let e = null;

  const namespace = DOMNamespaces[tag] || _namespace;

  if (namespace) {

    e = document.createElementNS(namespace, tag);

    e._namespaceURI = namespace;

  } else {

    e = document.createElement(tag);

  }

  return e;
}

export function setDOMAttribute(e, k, value) {

  if (typeof value === 'function') {

    if (e.$attributes['$' + k]) {
       e.removeEventListener(k, e.$attributes['$' + k]);
    }

     const fn = (ev) => value(Object.assign(ev, { dataset: parseDataset(ev.currentTarget.dataset) }));
     e.$attributes['$' + k] = fn;
     addEventListener(e, k, fn);

  } else if (k === 'data') {

    Object.assign(e.dataset, Object.keys(value).reduce(( r, key) => {
      const v = value[key];
      if (typeof v !== 'object') {
        r[key] = v;
      }
      return r;
    }, {}));

  } else if (flagAttrs[k]) {

    e[k] = value ? true : null;

  } else if (instantAttrs[k]) {

    e[k] = value;

  } else {

    e.setAttribute(k, value);
  }
}

export function removeDOMAttribute(e, k) {

  if (e.$attributes['$' + k]) {

    e.removeEventListener(k, e.$attributes['$' + k]);

  } else if (k === 'data') {

    e.dataset = {};

  } else if (flagAttrs[k]) {

    e[k] = null;

  } else if (instantAttrs[k]) {

    e[k] = null;

  } else {

    e.removeAttribute(k);
  }
}

export const doneFn = (c) => {
  c.$isDone = true;
  c.onDone();
  return null;
 };

export const finalizerFn = function () {

  objForEach(this.$sub, doneFn);

  this.$sub = null;
  this.$parent = null;
  this.$children = null;
  this.element = null;
};

export function wrapRenderer(renderer) {

  return (meta, component) => {

    // avoid rendering after done
    if (component.$isDone) {
      return;
    }
    // avoid recurrsive rendering
    if (component.$isRendering) {
      // debounce sequental rendering

      if (!component.$pendingRendering) {
        component.$pendingRendering = true;
        setTimeout(()=>{
          component.$pendingRendering = false;
          component.invalidate();
        }, 10);
      }
      return;
    }

    component.$isRendering = true;

    const element = renderer(meta, component);

    component.$isRendering = false;

    return element;
  };

}

export function resolveDOMElement(meta, { parentElt, prevElt }, $key) {

  const placeholder = (prevElt ? prevElt.nextSibling : parentElt.firstChild) || null;

  let c = placeholder &&
    placeholder.nodeName.toLowerCase() === meta.tag.toLowerCase() &&
    (placeholder.$key === $key || placeholder.$key.split('$')[0] === $key.split('$')[0]) ?
    placeholder :
    null;

  if (!c) {

    c = createElement(meta, parentElt._namespaceURI);

    c.$key = $key;

    appendDOMElement(c, parentElt, placeholder);

  } else {

    applyDOMAttributes(c, meta.attributes);

    if (c !== placeholder) {

      appendDOMElement(c, parentElt, placeholder);
    }
  }

  return c;
}

export function createElement(meta, _namespace) {

  let e = null;
  if (meta.tag === '#text') {

    e = document.createTextNode(meta.attributes.text);
    e.$attributes = {};

  } else {

    e = createDomElement(meta.tag, _namespace);

    e.$attributes = {};

    applyDOMAttributes(e, meta.attributes);

  }

  return e;
}

export function clearAfter(parent, _c) {

  let c = _c ? _c.nextSibling : parent.firstChild;
  while (c) {
    let t = c;
    c = c.nextSibling;
    parent.removeChild(t);
  }
}

export function applyDOMAttributes(e, _attrs) {

  if (_attrs) {

    const lastAttrs = e.$attributes;

    if (e.nodeName === '#text') {

      const text = _attrs.text;

      if (e.textContent !== text) {
        e.textContent = text == null ? '' : text;
      }

    } else {

      objForEach(lastAttrs, (_value, key) => {
        const value = _attrs[key];
        if (value == null) {
          removeDOMAttribute(e, key);
        }
      });

      objForEach(_attrs, (value, key) => {
        const lastValue = instantAttrs[key] ? e[key] : lastAttrs[key];
        if (value != null && value !== lastValue) {
          setDOMAttribute(e, key, value);
        }
      });
    }

    e.$attributes = _attrs;
  }
}
