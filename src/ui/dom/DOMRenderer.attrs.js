/* eslint no-eq-null: "off" */
/* eslint eqeqeq: "off" */
import { objForEach } from '../../utils/obj.js';

const flagAttrs = {
    disabled: 'yes',
    selected: 'true'
};

const instantAttrs = {
    value: 1,
    checked: 1
};
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

export function parseDataset(dataset) {
  return Object.keys(dataset).reduce(( r, key) => {
    r[key] = parsePrimitive(dataset[key]);
    return r;
  }, {});
}

const addEventListener = window.addEventListener ?
   (e, eventName, listener) => e.addEventListener(eventName, listener, false) :
   (e, eventName, listener) => e.attachEvent('on' + eventName, listener);

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

export function setDOMAttribute(e, k, value) {

  if (typeof value === 'function') {
    const lstnrs = e.$listeners || (e.$listeners = {});
    if (lstnrs[k]) {
       e.removeEventListener(k, lstnrs[k]);
    }

    const fn = (ev) => value(Object.assign(ev, { dataset: parseDataset(ev.currentTarget.dataset) }));
    lstnrs[k] = fn;
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

  if (e.$listeners && e.$listeners[k]) {

    e.removeEventListener(k, e.$listeners[k]);

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
