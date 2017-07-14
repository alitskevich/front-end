// import {isObject} from 'Utils.es6';

const isObject = (o)=> (o && typeof o === 'object');

const REGISTRY = new Map();

const NON_OBJECT = { retainCount:0 };

function getItem(obj) {

    let r = NON_OBJECT;
    if (isObject(obj)) {

        r = REGISTRY.has(obj);
        if (!r) {

            REGISTRY.set(obj, r = { obj, retainCount });

        }
    }
    return r;
}

function destroy(obj) {
    // [native]
}

export default class GarbageCollector {

  release(obj) {

    getItem(obj).retainCount--;
  }

  releaseAll(targetMap) {

    targetMap.forEach((obj)=>getItem(obj).retainCount--);
  }

  retain(obj, oldValue) {

    getItem(obj).retainCount++;
  }

  clean() {

      REGISTRY.filter(r=>!r.retainCount).forEach( r => destroy(r));
  }

}
