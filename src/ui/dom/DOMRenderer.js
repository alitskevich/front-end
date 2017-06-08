import { resolveDOMElement, ensureEltPosition, clearAfter, wrapRenderer } from './DOMRenderer.util.js';
import { applyDOMAttributes } from './DOMRenderer.attrs.js';

const finalizerFn = function (c) {

  c.element = null;
};

const initializerFn = function (c) {

  c.forEachChild(initializerFn);

  if (c.$retained === true) {
    c.addFinalizer(finalizerFn);
    c.onInit();
  } else {

  }
};

export const renderer = wrapRenderer((meta, c) => {

  if (!c.element) {

    c.element = resolveDOMElement(meta, c.$renderParams, `${meta.$key}` );

  } else {

    applyDOMAttributes(c.element, meta.attributes);
  }

  if (meta.children) {

    renderSubs(c, meta.children);

    initializerFn(c);
  }

});

renderer.prepareRoot = function (root, config) {

  root.$renderParams = config;

  root.$retained = true;

  root.addFinalizer(finalizerFn);

};

function getSubComponent(meta, parent, params) {

  const { component, children, attributes = {}, $key } = meta;

  let c = parent.getChild($key);
  if (!c) {

    const Ctor = component;
    c = new Ctor(attributes);
    parent.addChild($key, c);
    c.$retained = true;

  } else {

    c.$retained = {};
  }
  c.$renderParams = params;
  c.$childrenMeta = children;

  return c;

}
function renderSubComponent(meta, parent, params) {

  const { $key } = meta;

  let c = getSubComponent(meta, parent, params);

  if (c.$retained === true) {

    const m = c.resolveTemplate();

    m.$key = $key;

    if (m.children) {
      // const frag = c.element = document.createDocumentFragment();

      c.element = resolveDOMElement(m, params, `${m.$key}` );
      renderSubs(c, m.children);

      // c.element.appendChild(frag);
    } else {
      c.element = resolveDOMElement(m, params, `${m.$key}` );
    }

  } else {

    ensureEltPosition(c.element, params);
    c.update(meta.attributes);
  }

  return c.element;
}

function _renderChildren(element, children, target) {

    // createPool(element);

    const p = { parentElt: element, renderer };

    const lastElt = children.reduce(function reducer(prevElt, meta) {

      p.prevElt = prevElt;

      if (meta.component) {

        return renderSubComponent(meta, target, p);
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

function renderSubs(c, children) {

  c.forEachChild(cc=>(cc.$retained = false));

  _renderChildren(c.element, children, c, c.$renderParams);

  c.forEachChild(cc => { if (!cc.$retained) { cc.onDone(); } });

}
