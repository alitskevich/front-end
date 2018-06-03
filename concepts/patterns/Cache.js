export default class Cache {
  constructor(factory) {
    const map = new WeakMap();
    this.invalidate = (key) => map.delete(key)
    this.has = (key) => map.has(key)
    this.get = (key) => {
      if (!this.has(key)) {
        const value = factory(x);
        map.set(key, value);
        return value;
      }
      return map.get(key);
    }
    // 5 min by default
    this.timeoutInSeconds = 5 * 60;
    // 5 min by default
    this.ttlInSeconds = 5 * 60;

    this.factory = f;
  }

  fetch(x, cb = fnVoid) {

    const entry = this.all.get(x);

    const { instance, pending } = entry;

    if (instance) {

      cb(null, instance);

    } else if (pending) {

      pending.push(cb);

    } else {

      entry.pending = [cb];
      const callback = (err, _instance)=>{
        // console.log('instance',err, instance)

        if (!err && _instance) {
          entry.instance = _instance;
        }

        let cbs = entry.pending;
        entry.pending = null;
        if (cbs) {
          for (let cb2 of cbs) {
            cb2(err, _instance);
          }
        }

      };

      this.factory.call(null, x, callback);

      if (this.timeoutInSeconds) {

        setTimeout(()=>callback(new Error('Timeout')), this.timeoutInSeconds * 1000);
      }

      if (this.ttlInSeconds) {

        setTimeout(()=>this.remove(x), this.ttlInSeconds * 1000);
      }
    }
  }

  load(x) {
    return new Promise((resolve, reject) =>
      this.fetch(x, (err, instance) => {
        if (err) {
          reject(err);
        } else {
          resolve(instance);
        }
      })
    );
  }
}
