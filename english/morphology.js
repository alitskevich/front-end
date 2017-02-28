import { loader } from './resources';
import Form from './Form.js';
import Memoize from '../concepts/Memoize.js';

const ROOT_SIGNATURES = {};
const CHARS = {};
const ABBR = {};
const HARDCODED = {};
const ROOTS = {};

const META = {
  roots: { data: ROOTS },
  chars: { data: CHARS },
  root_masks: { data: ROOT_SIGNATURES },
  abbr: { data: ABBR },
  hardcode: { data: HARDCODED },
  intrix: { loadType: 'tree', data: {} },
  complexie: { loadType: 'tree', data: {} },
  prefix: { loadType: 'tree', data: {} },
  suffix: { loadType: 'reverseTree', data: {} },
  flexie: { loadType: 'reverseTree', data: {} },
  endix: { loadType: 'reverseTree', data: {} }
};

const DERIVATION_PATH = {
  SHORT: { starting:['complexie', 'prefix'], ending:['suffix', 'flexie'] },
  FULL: { starting:['intrix', 'complexie', 'prefix'], ending:['suffix', 'flexie', 'endix'] }
};

function signature(x) {
  var c, l = x.length, r = 'e';
  for (let i = 0; i < l; i++) {
    c = x[i];
    let t = CHARS[c + (x[i + 1] || '$') + (x[i + 2] || '$')] || CHARS[c + (x[i + 1] || '$')] || CHARS[c];
    if (!t) {
      return false;
    }
    r += t.type;
  }
  return r;
}

export function hasRootSignature(lx) {

  return ROOTS[lx.text] || ROOT_SIGNATURES[signature(lx.text)];
}

function checkAllTheSameRoot(morphs) {
  let min = morphs[0];
  const roots = morphs.reduce((rr, m) => {
    if (min.text.length > m.text.length) {
      min = m;
    }
    let a = rr[m.text];
    if (!a) {
      a = rr[m.text] = m;
    }
    return rr;
  }, {});

  const rootsKeys = Object.keys(roots);
  if (rootsKeys.length === 1) {
    const one = roots[rootsKeys[0]];
    one.certain = true;
    return one;
  }

  return min;
}

function deriveForm(ax, forms = [], kindset = DERIVATION_PATH.FULL) {

  forms.push(ax);

  for (let kind of kindset.starting) {
    if (ax[kind] == null) {
      ax[kind] = '';
      let sub = META[kind].data;
      for (let c, p = 0, r, x = ax.text, l = x.length - 2, rest; p < l && (c = x[p]) && sub && (sub = sub[c]); p++) {
        r = sub['_'];
        if (r) {
          rest = x.slice(p + 1);
          if (rest.length > 1) {
            deriveForm(ax.clone({ [kind]: r.id, text: rest, tags: r.tags }), forms, DERIVATION_PATH.SHORT);
          }
        }
      }
    }
  }

  for (let kind of kindset.ending) {
    if (ax[kind] == null) {
      ax[kind] = '';
      let sub = META[kind].data;
      for (let c, r, x = ax.text, rest, p = x.length - 1; p > 1 && (c = x[p]) && sub && (sub = sub[c]); p--) {
        r = sub['_'];
        if (r ) {
          rest = x.slice(0, p);
          if (rest.length > 1) {
            deriveForm(ax.clone({ [kind]: x.slice(p), text: rest, tags: r.tags }), forms, DERIVATION_PATH.SHORT);
          }
        }
      }
    }
  }

  return forms;
}

function qualifyForms(forms0, tags = {}) {

  let most = forms0[0];
  const rmorphs = forms0.filter(hasRootSignature);
  let forms = rmorphs;

  if (!rmorphs.length) {
    forms = [most];
    tags.unclassified = true;

  } else if (rmorphs.length === 1) {

    most = rmorphs[0];
    tags.certain = true;

  } else {

    const same = checkAllTheSameRoot(rmorphs);
    if (same) {
      most = same;
      tags.certain = same.certain;
      tags[`__${most.text}`] = true;
    }
  }

  return { forms, most, tags };
}

const analyze = Memoize.create((lx)=> {

  const text = lx.text;

  const predefined = HARDCODED[text] || ABBR[text];
  if (predefined) {

    lx.tags = predefined.tags;

  } else if (lx.tags.word) {

    Object.assign(lx, qualifyForms(deriveForm(new Form({ text: lx.id }))));
  }

});

export default {

  init: (data = {}) => loader(META, data),

  apply: (root) => root.forEach(lx => analyze(lx)),

  analyze
};
