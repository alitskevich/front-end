import { resolveDOMElement, clearAfter } from './DOMRenderer.util.js';
import { objMap, objForEach } from '../../utils/obj.js';

const done = (c) => {
  c.onDone();
  return null;
 };

const finalizerFn = function () {

  objForEach(this.$sub, done);

  this.$sub = null;
  this.$parent = null;
  this.$children = null;
  this.element = null;
};

export function renderer(meta, component) {

  objForEach(component.$sub, c => (c.$retained = false));

  // for root element:
  if (!component.element) {
    component.addFinalizer(finalizerFn);
  }

  const element = component.element = _renderer(meta, component);

  component.$sub = objMap(component.$sub, (c, key) => (c.$retained ? c : done(c)));

  return element;

}

export function _renderer(meta, parent, params = parent.$renderParams || {}) {

  const { component, children, attributes = {}, $key } = meta;

  let element = null;

  if (component) {

    const existing = parent.$sub && parent.$sub[$key];

    const Ctor = component;

    const c = existing || new Ctor(attributes);

    (parent.$sub || (parent.$sub = {}))[$key] = c;

    c.$renderParams = params;
    c.$children = children;
    c.$parent = parent;
    c.$retained = true;

    if (existing) {

      c.onInput(attributes);

      element = c.element;

    } else {

      element = c.element = _renderer(c.resolveTemplate(), c, params);

      c.onInit();

      c.addFinalizer(finalizerFn);
    }

  } else {

    element = resolveDOMElement(meta, params);

    if (children) {

      const lastChildElt = children.reduce((prevElt, meta2) =>
          _renderer(meta2, parent, { parentElt: element, prevElt, renderer }),
          null);

      clearAfter(element, lastChildElt);
    }
  }

  return element;
}
