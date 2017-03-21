import { resolveDOMElement, clearAfter, finalizerFn, doneFn, wrapRenderer } from './DOMRenderer.util.js';
import { objMap, objForEach } from '../../utils/obj.js';

export const renderer = wrapRenderer((meta, component) => {

  objForEach(component.$sub, c => (c.$retained = false));

  // for root element:
  if (!component.element) {
    component.addFinalizer(finalizerFn);
  }

  const element = component.element = _renderer(meta, component);

  component.$sub = objMap(component.$sub, (c, key) => {

    if (!c.$retained) {
      doneFn(c);
      return;
    }

    if (!c.$inited) {
      c.$inited = true;
    }
    return c;

  });

  return element;

});

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

      c.update(attributes);

    } else {

      c.element = _renderer(c.resolveTemplate(), c, params);
      c.onInit();
      c.addFinalizer(finalizerFn);
    }

    element = c.element;

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
