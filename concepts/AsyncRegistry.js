import { fnVoid } from '../utils/fn.js';
import Memoize from './Memoize.js';

function fetch(x, cb = fnVoid) {

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

/**
 * Async Registry utility.
 */
export default class AsyncRegistry {

  constructor(f) {

    this.all = Memoize.create(x=>({}));
    // 5 min by default
    this.timeoutInSeconds = 5 * 60;
    // 5 min by default
    this.ttlInSeconds = 5 * 60;

    this.factory = f;
  }

  remove(x) {

    this.all.remove(x);
  }

  get(x) {

    return this.all.get(x).instance;
  }

  put(x, instance) {

    this.all.get(x).instance = instance;

    return instance;
  }

  load(x) {

    return new Promise((resolve, reject) =>
      fetch.call(this, x, (err, instance) => {
        if (err) {
          reject(err);
        } else {
          resolve(instance);
        }
      })
    );
  }
}
