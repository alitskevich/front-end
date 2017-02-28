function detachMe(e) {

  if (e._parent) {

    const prev = e.prev;
    const next = e.next;

    if (next) {
      e._next._prev = prev;
      e._next = null;
    } else {
      e._parent.last = prev || null;
    }

    if (prev) {
      e._prev._next = next;
      e._prev = null;
    } else {
      e._parent.first = next || null;
    }

    e._parent = null;
  }
}

function setParent(e, parent, _after, _before) {

  if (e && parent && e !== parent && (!_after || e !== _after)) {

    e._parent = parent;
    e.level = (parent.level || 0) + 1;

    const after = _after || _before && _before._prev;
    const before = _before || _after && _after._next;

    if (after || before) {
      // console.log('setParent', after,  e,  before)
      if (before) {
        before._prev = e;
      } else {
        parent.last = e;
      }

      if (after) {
        after._next = e;
      } else {
        parent.first = e;
      }

      e._prev = after;
      e._next = before;

    } else {

      parent.first = e;
      parent.last = e;
    }
  }
}

export function applyTreeItemProps(target) {

  Object.defineProperty(target, 'parent', {
    isEnumerable: false,

    get: function () { return this._parent || null; },
    set: function (parent) {

      if (this._parent === parent) {
        return;
      }

      detachMe(this);
      if (parent) {
        setParent(this, parent, parent.last);
      }
    }
  });

  Object.defineProperty(target, 'next', {
    isEnumerable: false,

    get: function () { return this._next || null;},
    set: function (e) {

      if (e && this._next !== e) {
        detachMe(e);
        setParent(e, this.parent, this);
      }
    }

  });

  Object.defineProperty(target, 'prev', {
    isEnumerable: false,
    get: function () { return this._prev || null;},
    set: function (e) {

      if (e && this._prev !== e) {
        detachMe(e);
        setParent(e, this.parent, null, this);
      }
    }
  });
}

export default class TreeItem {

  constructor(options) {

    applyTreeItemProps(this);

    Object.assign(this, options);
  }

  toString() {

    return this.text;
  }
}
