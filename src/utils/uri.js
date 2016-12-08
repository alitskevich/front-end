import { undefOrNull } from './obj.js';

/**
 * Uri class:
 *
 * - serialize/parse
 * - syntax: method!type://target:index/[path]?{params}#data
 * - encode/decode params and data into typed values including objects/arrays
 * - supports array of sources for factory function
 * - immutable in deep. may be cloned with extra delta
 *
 */
export default class Uri {

  static instanceOf(obj) {

    return obj && obj.constructor === Uri;
  }

  static create(...sources) {

    if (sources.length === 1 && Uri.instanceOf(sources[0])) {
      return sources[0];
    }

    const r = new Uri();

    update(r, sources);

    r.params = Object.freeze(r.params || {});

    r.path = Object.freeze(r.path || []);

    r.id = (r.target ? `${r.type ? `${r.type}:` : ''}//${r.target}/` : '/') +
      (r.path ? r.path.join('/') : '');

    return Object.freeze(r);
  }

  clone(...deltas) {

    return Uri.create([ this ].concat(deltas));
  }

  toString() {

    return stringify(this);
  }
}

export function parse(r, s0) {

  let p, s = s0;

  // extract method:
  p = s.indexOf('!');
  if (p > -1) {
    r.method = s.slice(0, p);
    s = s.slice(p + 1);
  }

  // extract type:
  p = s.indexOf('://');
  if (p > -1) {
    r.type = s.slice(0, p);
    s = s.slice(p + 1);
  }

  // extract data:
  p = s.indexOf('#');
  if (p > -1) {
    r.data = decodeValue(s.slice(p + 1));
    s = s.slice(0, p);
  }

  // extract query params:
  p = s.indexOf('?');
  if (p > -1) {

    r.params = {};
    for (let param of s.slice(p + 1).split('&')) {

      let [key, value] = param.split('=');
      if (value) {
        r.params[ key ] = decodeValue(value);
      }
    }

    s = s.slice(0, p);
  }

  if (s === '') {
    return;
  }

  // work with target and path:
  let path = r.path = s.split('/');
  if (path[ 0 ] === '') {

    path.shift();

    if (path[ 0 ] === '') {

      path.shift();

      r.target = s = path.shift();

      // extract auth:
      p = s.indexOf('@');
      if (p > -1) {
        r.auth = s.slice(0, p);
        r.target = s = s.slice(p + 1);
      }

      // extract index:
      p = s.indexOf(':');
      if (p > -1) {
        r.index = s.slice(p + 1);
        r.target = s.slice(0, p);
      }
    }
  }

}

// represent as string
export function stringify(r) {

  let result = '';

  if (r.target) {

    if (r.method) {
      result += r.method + '!';
    }

    if (r.type) {
      result += r.type + ':';
    }

    result += '//';

    if (r.auth) {
      result += r.auth + '@';
    }

    result += r.target;

    if (r.index) {
      result += ':' + r.index;
    }

  }

  if (r.path) {

    result += '/' + r.path.join('/');
  }

  const params = r.params;
  if (params) {

    const keys = Object.keys(params).filter((key)=>!undefOrNull(params[ key ]));

    if (keys.length) {

      result += '?' + keys.map((key) => (key + '=' + encodeValue(params[ key ]))).join('&');
    }
  }

  if (r.data) {

    result += '#' + encodeValue(r.data);
  }

  return result;
}

export function assign(r, s) {

  Object.keys(s).forEach((key)=> {

    if (key === 'path') {

      r.path = typeof s.path === 'string' ? s.path.split('/') : s.path;

    } else if (key === 'params') {

      r.params = Object.assign({}, r.params, s.params );

    } else {

      r[ key ] = s[ key ];
    }
  });
}

export function update(r, s0) {

  let type = typeof s0;
  let s = s0;

  if (type === 'function') {
    s = s();
    type = typeof s;
  }

  if (type === 'string') {

    parse(r, s);

  } else if (type === 'object') {

    if (Array.isArray(s)) {

      for (let ss of s) {
        if (ss) {
          update(r, ss);
        }
      }

    } else {
      assign(r, s);
    }

  } else {

    r.data = s;
  }
}

export const VALUE_MAP = {
  ['true']: true,
  ['false']: false,
  ['undefined']: Object.undefined
};

export function decodeValue(val) {

  const value = decodeURIComponent(val);

  if ('{['.indexOf(value[ 0 ]) > -1) {

    return JSON.parse(value);
  }

  const num = +value;

  if (!isNaN(num)) {
    return num;
  }

  return VALUE_MAP[ value ] || value;
}

export function encodeValue(value) {

  return encodeURIComponent((typeof value === 'object') ? JSON.stringify(value) : `${value}`);
}
