/* eslint eqeqeq: "off" */
import { parsePrimitive } from './xml.js';

const w3 = 'http://www.w3.org/';
export const DOMNamespaces = {
    html: w3 + '1999/xhtml',
    mathml: w3 + '1998/Math/MathML',
    svg: w3 + '2000/svg'
};

export const flagAttrs = {
    disabled: 'yes',
    selected: 'true'
};

export const instantAttrs = {
    value: 1,
    checked: 1
};

const win = typeof window === 'undefined' ? {} : window;

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

     e.removeEventListener(k, e.$attributes['$' + k]);

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
