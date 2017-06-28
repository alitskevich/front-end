import { resolveDOMElement, ensureEltPosition, clearAfter, wrapRenderer } from './DOMRenderer.util.js';
import { applyDOMAttributes } from './DOMRenderer.attrs.js';

const finalizerFn = function (c) {

  c.element = null;
};

const initializerFn = function (c) {

  c.forEachChild(initializerFn);

  if (!c.$isInited) {
    c.addFinalizer(finalizerFn);
    c.onInit();
    c.$isInited = true;
  }
};

export const renderer = wrapRenderer((meta, c) => {

  if (meta.component) {
    meta.$key = c.$key;
    c.element = renderSubComponent(meta, c, c.$renderParams);

    initializerFn(c);

  } else {

    if (!c.element) {

      c.element = resolveDOMElement(meta, c.$renderParams, `${meta.$key}` );

    } else {

      applyDOMAttributes(c.element, meta.attributes);
    }

    if (meta.children) {

      renderSubs(c, meta.children);

      initializerFn(c);
    }
  }

});

renderer.prepareRoot = function (root, config) {

  root.$renderParams = config;
};

function renderSubComponent(meta, parent, params) {

  const { component, children, attributes = {}, $key } = meta;

  const existing = parent.getChild($key);
  let c = existing;
  if (!existing) {

    const Ctor = component;
    c = new Ctor(attributes);

    parent.addChild($key, c);

    c.$renderParams = params;

    c.$transclude = children;

    const m = c.resolveTemplate();

    m.$key = $key;

    if (m.component) {

      c.element = renderSubComponent(m, c, params);

    } else if (m.children) {
      const frag = c.element = document.createDocumentFragment();

      c.element = resolveDOMElement(m, params, `${m.$key}` );
      renderSubs(c, m.children);

      c.element.appendChild(frag);
    } else {
      c.element = resolveDOMElement(m, params, `${m.$key}` );
    }

  } else {

    ensureEltPosition(c.element, params);

    c.$transclude = children;

    c.update(meta.attributes);
  }

  c.$retained = true;

  return c.element;
}

function _renderChildren(element, children, target) {

    const lastElt = children.reduce(function reducer(prevElt, meta) {

      const p = { parentElt: element, renderer, prevElt };

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
