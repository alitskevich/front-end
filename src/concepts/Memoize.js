export default class Memoize {

  static create(factory, keyFn, all) {

    const m = new Memoize(factory, keyFn, all);

    return (x)=>m.get(x);
  }

  constructor(factory, keyFn = x=>x, value = new Map()) {

    this.factory = factory;
    this.keyFn = keyFn;
    Object.defineProperty(this, 'all', { value });
  }

  remove(x) {

    const key = this.keyFn(x);

    if (this.all.has(key)) {

      this.all.delete(key);
    }
  }

  forEach(fn) {

    this.all.forEach(fn);
  }

  get(x) {

    const key = this.keyFn(x);

    if (!this.all.has(key)) {

      const value = this.factory(x);
      this.all.set(key, value);
      return value;
    }

    return this.all.get(key);
  }
}
