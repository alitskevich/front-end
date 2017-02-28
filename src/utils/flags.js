
export function normalizeTags(tags) {

    return typeof tags !== 'string' ? tags :
        tags.split(' ')
          .reduce((r, s, i, arr, neg)=>
            (neg = s[0] === '!', r[neg ? s.slice(1) : s] = !neg, r), {});

}

export class Flags {

    constructor(options) {

      Object.assign(this, options);
    }

    is(key) {

        return this.tags[key] ? this : null;
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
}
