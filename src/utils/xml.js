/* eslint no-use-before-define: "off"*/
import { tokenizer } from './text.js';
import { curry } from './fn.js';

// let COUNTER = 0;

export const RE_XML_ENTITY = /&#?[0-9a-z]{3,5};/g;

export const RE_XML_COMMENT = /\<\!\-\-((?!\-\-\>)[\s\S])*\-\-\>/g;

export const RE_TAG = /(<)(\/?)([a-z][a-z0-9\:\.\-]*)((?:\s+[a-z][a-z0-9\-]+(?:=(?:\w+|(?:"[^"]*")))?)*)\s*(\/?)>/gi;

export const RE_ATTRS = /\s+([a-z][a-z0-9\-]+)(?:=(\w+|"[^"]*"))?/gi;

const SUBST_XML_ENTITY = {
  amp : '&',
  gt : '>',
  lt : '<',
  quot : `"`,
  nbsp : ' '
};

const FN_XML_ENTITY = function (_s) {

    const s = _s.substring(1, _s.length - 1);

    return s[0] === '#' ? String.fromCharCode(+s.substring(1)) : (SUBST_XML_ENTITY[s] || ' ');
};

export const decodeXmlEntities = (s = '') => s.replace(RE_XML_ENTITY, FN_XML_ENTITY);

const matchHtmlRegExp = /["'&<>]/g;

export function escapeXml(unsafe) {
  return !unsafe ? '' : ('' + unsafe).replace(matchHtmlRegExp, function (m) {
    switch (m.charCodeAt(0)) {
      // "
      case 34:
        return '&quot;';
      // &
      case 38:
        return '&amp;';
      // '
      case 39:
        return '&#39;';
      // <
      case 60:
        return '&lt;';
      // >
      case 62:
        return '&gt;';

      default:
        return '';
    }
  });
}

export const parsePrimitive = function (v) {

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

export const Attributes = {

  narrow:(attributes) => typeof attributes === 'string' ? Attributes.parse(attributes) : attributes,

  parse(s, r = {}) {
    if (!s) {
      return null;
    }
    let found = false;
    for (let e = RE_ATTRS.exec(s); e; e = RE_ATTRS.exec(s)) {
        const val = e[2] || '"true"';
        r[e[1]] = parsePrimitive(decodeXmlEntities(val.slice(1, -1)));
        found = true;
    }
    return found ? r : null;
  },

  stringify(obj) {
    return obj ? `${Object.keys(obj).filter(k=>obj[k]).map(k=>(` ${k}="${escapeXml(obj[k])}"`)).join('')}` : '';
  }
};

export class XmlNode {

  constructor(tag, attributes, children) {
    this.$key = 0;
    this.tag = tag;
    this.attributes = Attributes.narrow(attributes);
    if (children && children.length) {
      children.forEach(e=>this.addChild(e));
    }
  }

  getChild(index) {
    return this.children && this.children[index];
  }

  addChild(elt) {

    (this.children || (this.children = [])).push(elt);
    elt.$key = this.children.length - 1;
    return elt;
  }

  addText(text, $key) {
    return this.addChild(new XmlNode('#text', { text: decodeXmlEntities(text) }));
  }

  toString() {
    return xmlStringify(this);
  }
}

function _stringify(elt, tab) {

  const { tag = 'p', attributes, children } = elt;
  if (tag === '#text') {
    return `${tab}${escapeXml(attributes.text) || ''}`;
  }

  const attrs = Attributes.stringify(attributes);
  const ch = children && children
    .map(c=>((typeof c === 'string') ? c : _stringify(c, `  ${tab}`)))
    .join('\n');

  return `${tab}<${tag}${attrs}` + (!ch ? '/>' : `>\n${ch}\n${tab}</${tag}>`);
}

export const xmlStringify = (root, level = 0) => _stringify(root, '');

const xmlTokenizer = curry(tokenizer, RE_TAG,

  function (stack, [text, isTag, isClosingTag, tag, attributes, isSingleTag], $key) {

    const top = stack[0];
    // console.log(text, !!isTag, !!isClosingTag, !!isSingleTag, tag, attrs)

    if (!isTag) {

      if (text.trim()) {
        top.addText(text, $key);
      }
      return;
    }

    if (isClosingTag) {
      stack.shift();
      return;
    }

    const elt = top.addChild(new XmlNode(tag, attributes));

    if (!isSingleTag) {
      stack.unshift(elt);
    }
  }
);

export const xmlParse = (_s = '') => {
  const s = _s.replace(RE_XML_COMMENT, '');
  const result = xmlTokenizer(s, [new XmlNode()]);

  if (result.length !== 1) {

    return new XmlNode('#text', { text: 'Parse error' });
  }

  return result[0].getChild(0);
};
