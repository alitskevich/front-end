import { escapeXml } from './xml.js';

export const TAG_SPEC = {
    img:{ single:true },
    br:{ single:true },
    hr:{ single:true },
    p:{ nonRecursive:true },
    li:{ nonRecursive:true }
};

const EMPTY_STR = {
    '': 1,
    0: 1,
    false: 1,
    null: 1,
    undefined: 1
};

export const Style = {

    fromString(s) {

    },
    toString(st) {
        return st ? Object.keys(st).filter(k=>st[k]).map(k=>(`${k}:${st[k]}`)).join(';') : '';
    },
    toClass:(tags)=>tags ? ` class="${Object.keys(tags).filter(k=>tags[k]).join(' ')}"` : ''

};

export const Class = {

  toString(cl) {

    if (typeof cl === 'object') {
      return Object.keys(cl).filter((key) => (cl[key] && !(cl[key] in EMPTY_STR))).join(' ');
    }
    return cl;
  }
};

/**
 * Substitutes placeholders in given template with values from hash
 * ('abc{{key}}',{key:'Def'})->'abcDef'
 *
 * @param template string with placeholders
 * @param data object with key/values to substitute
 * @returns resulting {string}
 */
export function template(pattern, data) {

  return pattern.replace(/\{\{([^\{\}]+)\}\}/g, (match, key) => escapeXml(data[key]));
}
