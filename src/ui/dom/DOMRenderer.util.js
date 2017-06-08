import { applyDOMAttributes } from './DOMRenderer.attrs.js';

const w3 = 'http://www.w3.org/';

const DOMNamespaces = {
    html: w3 + '1999/xhtml',
    mathml: w3 + '1998/Math/MathML',
    svg: w3 + '2000/svg'
};

export function ensureEltPosition(element, { parentElt, prevElt }) {

  let placeholder = prevElt ? prevElt.nextSibling : parentElt.firstChild;

  if ( placeholder !== element) {

    appendDOMElement(element, parentElt, placeholder);
  }
}

export function createPool(element) {

  const pool = element.$pool = {};
  let p = element.firstChild;

  while (p) {
    pool[p.$key] = p;
    p = p.nextSibling;
  }

  return pool;
}

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

  let c = parentElt.$pool && parentElt.$pool[$key];

  if (!c) {

    c = createElement(meta, $key, parentElt);

  } else {

    applyDOMAttributes(c, meta.attributes);
  }

  if (c !== placeholder) {

    appendDOMElement(c, parentElt, placeholder);
  }

  return c;
}

export function createElement(meta, $key, parentElt) {

  let e = null;
  if (meta.tag === '#text') {

    e = document.createTextNode(meta.attributes.text);
    e.$attributes = {};

  } else {

    e = createDomElement(meta.tag, parentElt._namespaceURI);

    e.$attributes = {};

    applyDOMAttributes(e, meta.attributes);

  }
  // console.log('create DOM', $key);
  (parentElt.$pool || (parentElt.$pool = {}))[$key] = e;

  e.$key = $key;

  return e;
}

export function appendDOMElement(element, parent, before) {
  if (before) {
    parent.insertBefore(element, before);
  } else {
    parent.appendChild(element);
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

export function removeElt(e) {
  const parentElt = e.parentElement;
  if (parentElt) {

    parentElt.removeChild(e);

    const lstnrs = e.$listeners;
    if (lstnrs) {
      Object.keys(lstnrs).forEach(k=>e.removeEventListener(k, lstnrs[k]));
      e.$listeners = null;
    }
    // console.log('remove DOM', e.$key);

    if (parentElt.$pool) {
      delete parentElt.$pool[e.$key];
    }

    e.$key = e.$attributes = null;
  }
}

export function clearAfter(parent, _c) {

  let c = _c ? _c.nextSibling : parent.firstChild;

  while (c) {

    let t = c;

    c = c.nextSibling;

    removeElt(t);
  }
}
