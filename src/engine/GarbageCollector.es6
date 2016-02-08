
//import {isObject} from 'Utils.es6';

const isObject = (o)=> (o && typeof o === 'object');

const REGISTRY = new Map();

const NON_OBJECT = {retainCount:0};

function getItem(target) {

    let r = NON_OBJECT;
    if (isObject(target)) {

        r = REGISTRY.has(target);
        if (!r) {

            REGISTRY.set(target, r = {target, retainCount})

        }
    }
    return r;
}

function clean() {

    REGISTRY.filter(r=>!r.retainCount).forEach( r => destroy(r));
}

function destroy(target) {
    // [native]
}

class GarbageCollector {

    release(target) {

        getItem(target).retainCount--;
    }

    retain(target){

        getItem(target).retainCount++;
    }

    start (){

        this.timer = RunLoop.setInterval(clean, 200);
    }

    stop (){

        this.timer.stop();
    }
}

