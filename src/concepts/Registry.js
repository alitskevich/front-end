import Expiration from './Expiration.js';

/**
 * Registry ulitity class.
 * Supports async factory.
 *
 * TODO add invalidation
 */
export default class Registry {

    constructor(f){

        this.all= new Map();

        this.ttlInSeconds = 5*60;// 5 min by default

        this.factory = f;
    }

    reset(id) {

        this.all.delete(id);
    }

    get(id) {

        const e = this.all.get(id);

        return  e && e.instance;
    }

    requireEntry(id) {

        let e = null;

        if (!this.all.has(id)){

            this.all.set(id, e = {});

        } else {

            e = this.all.get(id);
        }
        return e;
    }

    put(id, data) {

        return this.requireEntry(id).instance = data;
    }

    load(id, opts) {
        return new Promise((resolve, reject)=>{

            this.instance(id, opts, (err, result)=>{

                if (err){
                    reject(err);
                } else {
                    resolve(result);
                }

            })
        });
    }

    instance(id, opts, cb){

        if (arguments.length === 2){
            cb = opts;
            opts = null;
        }

        const entry = this.requireEntry(id);

        if (entry.instance) {

            cb(null, entry.instance);

        } else if (entry.pending) {

            entry.pending.push(cb);

        } else {

            entry.pending = [cb];

            const result = this.factory.call(null, id, opts, (err, instance)=>{
                //console.log('instance',err, instance)

                if (!err && instance){
                    entry.instance = instance;
                }

                var cbs = entry.pending;
                entry.pending = null;

                for (var cb of cbs) {
                    cb && cb(err, instance);
                }

            });

            if (this.ttlInSeconds){
                Expiration.register(()=>this.reset(id), this.ttlInSeconds*1000);
            }
        }
    }
}