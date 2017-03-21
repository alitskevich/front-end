/* eslint no-eq-null: "off" */
import { objMap, objForEach } from '../../utils/obj.js';
import { appendDOMElement, setDOMAttribute, createDomElement, instantAttrs } from '../../utils/dom.js';

export const doneFn = (c) => {
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

    // avoid recurrsive rendering
    if (component.$isRendering) {
      // debounce sequental rendering
      if (!component.$pendingRendering) {
        component.$pendingRendering = true;
        setTimeout(()=>{
          component.$pendingRendering = false;
          renderer(meta, component);
        }, 1);
      }
      return;
    }

    component.$isRendering = true;

    const element = renderer(meta, component);

    component.$isRendering = false;

    return element;
  };

}
function isMatched(e, { tag, $key }) {

  return e.nodeName.toLowerCase() === tag.toLowerCase() && $key === e.$key;
}

export function resolveDOMElement(meta, { parentElt, prevElt }) {

  const placeholder = (prevElt ? prevElt.nextSibling : parentElt.firstChild) || null;

  let c = placeholder && isMatched(placeholder, meta) ? placeholder : null;

  if (!c) {

    c = createDOMElement(meta, parentElt._namespaceURI);

    appendDOMElement(c, parentElt, placeholder);

  } else {

    applyDOMAttributes(c, meta.attributes);

    if (c !== placeholder) {

      appendDOMElement(c, parentElt, placeholder);
    }
  }

  return c;
}

export function createDOMElement(meta, _namespace) {

  let e = null;
  if (meta.tag === '#text') {

    e = document.createTextNode(meta.attributes.text);
    e.$attributes = {};

  } else {

    e = createDomElement(meta.tag, _namespace);

    e.$attributes = {};

    applyDOMAttributes(e, meta.attributes);

  }

  e.$key = meta.$key;

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

      if (e.textContent !== _attrs.text) {
        e.textContent = _attrs.text;
      }

    } else {

      objForEach(lastAttrs, (_value, key) => {
        const value = _attrs[key];
        if (value == null) {
          e.removeAttribute(key);
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
