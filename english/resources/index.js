import { mirror } from '../../utils/str.js';

const forEachId = (e, op) => (op(e.id) || e.ids && e.ids.split(',').forEach(op));

const setInTree = (target, key, value) => (key.split('').reduce((r, k)=>(r[k] || (r[k] = {})), target)._ = value);

const TYPES = {

    flat: (target, id, e) => (target[id] = e),

    tree: setInTree,

    reverseTree: (target, id, e) => setInTree(target, mirror(id), e)
};

export const loader = (META, meta = {}) => {

  Object.keys(META).forEach(key => {

    const { loadType, data } = META[key];

    (meta[key] || []).forEach(e=>forEachId(e, id=>(TYPES[loadType || 'flat'](data, id, e))));
  });
  // console.log(meta);
  return meta;
};
