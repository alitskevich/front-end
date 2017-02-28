import { xmlStringify } from '../../utils/xml.js';

export function renderer({ tag, component, children, attributes }, parent, acc = []) {

  if (component) {

    const Ctor = component;

    const c = new Ctor(attributes);

    c.$children = children;

    c.onInit();

    renderer(c.resolveTemplate(), c, acc);

  } else {

    const childrenResult = !children ? null : children.map(c => renderer(c, parent));

    acc.push(xmlStringify({ tag, attributes, children: childrenResult }));
  }

  return acc.join('');
}
