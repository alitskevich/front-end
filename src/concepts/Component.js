/* eslint no-console: 0 */
import { getter } from '../utils/obj.js';
import Entity from './Entity.js';
import Property from './Property.js';
import system from './Application.js';

/**
 * A Component is an Entity that
 * 1) manages its state via properties and
 * 2) intended to be a part of a whole system:
 *    - life-cycle hooks to be invoked from container
 *    - events aware
 */
export default class Component extends Entity {

  static install = (c) => Property.install(c);

  constructor(initialState, options) {

    super({});

    Object.assign(this, options);

    Property.update(this, initialState);

    this.onCreate();
  }

  ////////////////////////
  // Events
  ///////////////////////
  emitEvent(event) {

    system.emitEvent(event);
  }

  ////////////////////////
  // Lifetime hooks
  ///////////////////////

  onCreate() {
  }

  onInit() {
    this.$isInited = true;
  }

  onDone() {

    if (this.$finalizers) {

      this.$finalizers.forEach(fn=>fn.call(this, this));
      this.$finalizers = null;
    }

    if (this.$children) {

      this.forEachChild(c => c.onDone());
      this.$children = null;
    }

    if (this.$parent) {
      this.$parent.removeChild(this.$key);
    }
    this.$isDone = true;
  }

  onError(error) {

    console.error(error);
  }

  addFinalizer(fn) {

    (this.$finalizers || (this.$finalizers = [])).push(fn);
  }

  ////////////////////////
  // Children
  ///////////////////////

  addChild($key, c) {

    if (c.$parent && c.$parent !== this) {
      c.$parent.removeChild(c);
    }

    c.$key = $key;
    c.$parent = this;

    if (!this.$children) {
      this.$children = new Map();
    }

    this.$children.set($key, c);

    return this;
  }

  getChild($key) {

    return this.$children ? this.$children.get($key) : null;
  }

  removeChild($key) {
    if (this.$children) {
      return this.$children.delete($key);
    }
  }

  forEachChild(fn) {
    if (this.$children) {
      return this.$children.forEach(fn);
    }
  }
  ////////////////////////
  // State
  ///////////////////////

  keys() {

    return this.constructor.$PROP_KEYS;
  }

  has(key) {

    return Property.has(this, key);
  }

  getByKeys(keys = this.keys()) {

    return keys.reduce((r, key)=>{ r[key] = this.get(key); return r; }, {});
  }

  get(key) {

    // memoized
    const memoized = this.$ && getter.call(this.$, key);
    if (typeof memoized !== 'undefined') {

      return memoized;
    }

    // from properties or own member
    const value = getter.call(this, key);
    if (typeof value !== 'undefined') {

      return typeof value === 'function' ? this.memoize(key, value.bind(this)) : value;
    }

    // not found
    return Object.undefined;
  }

  update(delta) {

    const { info, payload } = Property.diff(this, delta);

    if (info.length) {

      Property.update(this, payload);

      this.callChangedHooks(info);
    }

    return info;
  }

  ////////////////////////
  // Routines
  ///////////////////////

  callChangedHooks(changed) {

    changed.forEach(({ key, value, oldValue }) => {

      const hook = this.get(`${key}Changed`);
      if (hook) {

        try {

          hook.call(this, { value, oldValue, target: this, id: this.id });

        } catch (ex) {

          this.onError({ ...ex, message: `Error in ${key} hook: ${ex.message}` });
        }
      }
    });
  }

  memoize(key, value) {

    ( this.$ || (this.$ = {}) )[key] = value;

    return value;
  }
}
