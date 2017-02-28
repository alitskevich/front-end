import { normalizeTags } from '../utils/flags.js';
import { applyTreeItemProps } from '../structures/TreeItem.js';
import Nil from './Nil.js';

/*
 * The Lexon.
 */
export default class Lexon {

  static create(opts = {}) {

    return new Lexon(opts);
  }

  static Nil = Nil;

  constructor(options) {

    applyTreeItemProps(this);

    Object.assign(this, options);
  }

  clone(opts) {

    return new Lexon({ ...this, ...opts });
  }

  isNil() {

    return false;
  }

  get nextOrNil() {

    return this.next || Nil;
  }

  is(key) {

    return this.markers[key] || (this.tags[key] && this) || Nil;
  }

  isNext(...keys) {
    const nx = this.next || Nil;
    return nx.isAny(...keys);
  }

  someOrNull() {
    return this;
  }

  someOrElse(x) {
    return this;
  }

  isAny(...keys) {

      for (let key of keys) {
          let x = this.is(key);
          if (x) {
            return x;
          }
      }

      return Nil;
  }

  get tags() {

    return this._tags || (this._tags = {});
  }

  set tags(tags) {

     this._tags = { ...this._tags, ...normalizeTags(tags) };
  }

  get text() {

    return this._text || '?';
  }

  set text( text ) {

    this._text = text;
    this.id = this.text.toLowerCase();
  }

  get markers() {

    return this._markers || (this._markers = {});
  }

  set markers(markers) {

     this._markers = { ...this._markers, ...markers };
  }

  setMarker(m, target) {

    if (target === this) {
      this.tags[m] = 1;
    } else {
      this.markers[m] = target;
    }

    return this;
  }

  eachTag(fn) {

    for (let k in this.tags) {
      fn.call(this, k, this.tags[k]);
    }
    for (let k in this.markers) {
      fn.call(this, k, this.markers[k]);
    }
  }

  apply(ops) {

    for (let op of ops) {
      op.apply(this);
    }
    return this;
  }

  children(cond, r = []) {

    return this.first ? this.first.range(null, cond, r) : r;
  }

  forEachChild(fx, cond, _r) {
    let r = _r;
    for (let lx = this.first, lxx; lx; lx = lxx) {
      lxx = lx.next;
      if (!cond || (cond.call ? cond.call(this, lx) : !lx.is(cond).isNil())) {
        r = fx(lx, r);
      }
    }

    return r;
  }

  range(last, cond, r = []) {

    for (let lx = this; lx; lx = lx.next) {
      if (!cond || cond.call(this, lx)) {
        r.push(lx);
      }
      if (lx === last) {
        break;
      }
    }

    return r;
  }

  get all() {

    return function*() {

      for (let lx = this.first, lxx; lx; lx = lxx) {
        lxx = lx.next;
        yield lx;
        for (lxx of lx.all()) {
          yield lxx;
        }
      }
    };
  }

  forEach(fx) {

     for (let lx = this.first, lxx; lx; lx = lxx) {
      lxx = lx.next;
      fx(lx);
      lx.forEach(fx);
    }
    return this;
  }

  /**
   * manipulations
   */

  newChild(opts) {

    return new Lexon({ ...opts, parent: this });
  }

  wrap(target = this, top = new Lexon({ tags:'wrapper' })) {

    target.next = top;

    let lx = this.next, lxx;
    this.parent = top;
    while (lx && (lx !== top)) {
      lxx = lx.next;
      lx.parent = top;
      lx = lxx;
    }

    return top;
  }

  removeChildren(filter) {

    this.forEachChild(lx=>(lx.parent = null), filter);

    return this;
  }

  inspect() {

    const r = this.forms;
    const cl = Object.keys(this.tags).concat(Object.keys(this.markers)).join(',');
    // this.forEach(e=>r.push(e.inspect()));

    return `<${this.text} ${cl} ${this.most ? this.most.name : ''}>${r && r.map(f=>f.name) || ''}</${this.text}>`;

  }

  toString() {

    return JSON.stringify(this.inspect());
  }
}
