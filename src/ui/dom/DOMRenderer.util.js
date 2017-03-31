/* eslint no-eq-null: "off" */
import { objForEach } from '../../utils/obj.js';
import { appendDOMElement, setDOMAttribute, createDomElement, instantAttrs } from '../../utils/dom.js';

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
    placeholder.$key === $key ? placeholder : null;

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
