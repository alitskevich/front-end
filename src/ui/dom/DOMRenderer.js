import { resolveDOMElement, ensureEltPosition, clearAfter, createPool, wrapRenderer } from './DOMRenderer.util.js';
import { applyDOMAttributes } from './DOMRenderer.attrs.js';

const finalizerFn = function () {

  if (this.$sub) {
    this.$sub.forEach((c) => c.onDone());
  }

  this.$sub = this.$parent = this.$children = this.element = null;
};

export const renderer = wrapRenderer((meta, c) => {

  if (!c.element) {

    c.element = resolveDOMElement(meta, c.$renderParams, `${meta.$key}` );

  } else {

    applyDOMAttributes(c.element, meta.attributes);
  }

  if (meta.children) {

    renderSubs(c, meta.children);
  }
});

renderer.prepareRoot = function (root, config) {

  root.$renderParams = config;

  root.$renderParams.parentElt.$pool = {};

  root.addFinalizer(finalizerFn);

  root.onInit();

};

function _renderComponent(meta, parent, params) {

  const { component, children, attributes = {}, $key } = meta;

  let c = parent.$sub.get($key);
  if (!c) {

    const Ctor = component;
    c = new Ctor(attributes);
    parent.$sub.set($key, c);
    c.$retained = 2;
    c.$renderParams = params;
    c.$children = children;
    c.$parent = parent;
    const m = c.resolveTemplate();

    m.$key = c.$key = $key;

    const frag = c.element = document.createDocumentFragment();
    if (m.children) {

      renderSubs(c, m.children, ()=>{
        c.element = resolveDOMElement(m, params, `${m.$key}` );
        c.element.appendChild(frag);
      });
    }

  } else {

    c.$retained = 1;
    c.$renderParams = params;
    c.$children = children;
    c.$key = $key;
    c.$parent = parent;

    ensureEltPosition(c.element, params);

    c.update(attributes);
  }

  return c.element;
}

function _renderChildren(element, children, target) {

    createPool(element);

    const p = { parentElt: element, renderer };

    const lastElt = children.reduce(function reducer(prevElt, meta) {

      p.prevElt = prevElt;

      if (meta.component) {

        return _renderComponent(meta, target, p);
      }

      const e = resolveDOMElement(meta, p, `${meta.$key}` );

      if (meta.children) {

        _renderChildren(e, meta.children, target, p);
      }

      return e;
    }, null);

    clearAfter(element, lastElt);

    return element;

}

function renderSubs(c, children, cb) {

  if (!c.$sub) {
    c.$sub = new Map();
  } else {
    c.$sub.forEach(cc=>(cc.$retained = 0));
  }

  _renderChildren(c.element, children, c, c.$renderParams);

  if (cb) {

    cb();
  }

  c.$sub.forEach(cc => {
    if (!cc.$retained) {
      cc.onDone();
      c.$sub.delete(cc.$key);
    }
  });

  c.$sub.forEach(cc => {
    if (cc.$retained === 2) {
      cc.addFinalizer(finalizerFn);
      cc.onInit();
    }
  });

}
