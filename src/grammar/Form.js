import { normalizeTags } from '../utils/flags.js';

export default class Form {

    constructor(defaults) {

      Object.assign(this, defaults);
    }

    is(key) {

      return this.markers[key] || (this.tags[key] ? this : null);
    }

    isAny(...keys) {

      for (let key of keys) {
        let x = this.is(key);
        if (x) {
          return x;
        }
      }

      return null;
    }

    get tags() {

      return this._tags || (this._tags = {});
    }

    set tags(tags) {

       this._tags = { ...this._tags, ...normalizeTags(tags) };
    }
    get name() {

      return (this.negation || '') +
        (this.prependix ? this.prependix + '-' : '') +
        (this.prefix || '') +
        (this.complexie ? '{' + this.complexie + '}' : '') +
        '[' +
        (this.text || '-') +
        (!this.root || (this.root === this.x) ? '' : '=' + this.root) +
        ']' +
        (this.suffix || '') +
        (this.flexie ? ':' + this.flexie : '') +
        (this.appendix ? ':' + this.appendix : '');
    }

    clone(opts) {

      return new Form({ ...this, ...opts });
    }
}
