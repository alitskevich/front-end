const ALL = new Map();

const GRANULARITY = 10000;

setInterval(()=> {

    var now = Date.now();
    var id = Math.ceil(now / GRANULARITY);
    const bundles = [];
    //console.log('Expiration::expire1',id, ALL.size)
    //console.log('Expiration::tick--------',id,  ALL.size)
    for (var iter = ALL.entries(), c = iter.next(); !c.done; c = iter.next()) {
        if (c.value[0] <= id) {
            bundles.push(c.value);
        }
        //console.log('Expiration::tick',c.value[0], c.value[1].size)
    }
    bundles.forEach(e=> {
        for (var iter = e[1].values(), c = iter.next(); !c.done; c = iter.next()) {
            c.value();
            //console.log('Expiration::expire4',c.value.__expId)
        }
        ALL.delete(e[0]);
    })


}, GRANULARITY);

export default {

    register(c, lag = 60000){

        if (c.__expId) {
            this.unregister(c);
        }

        var exp = Date.now() + lag
        var id = Math.ceil(exp / GRANULARITY);
        let bundle = ALL.get(id);
         if (!bundle) {
            bundle = new Set();
            ALL.set(id, bundle);
        }
        bundle.add(c);
        //console.log('Expiration::add',id, ALL.size, bundle.size)

        c.__expId = id;

        return c;
    },

    unregister(c){
        if (c.__expId) {
            const bundle = ALL.get(c.__expId);
            if (bundle) {
                bundle.delete(c);
                //console.log('Expiration::del',c.__expId, ALL.size, bundle.size)

            }
            c.__expId = null;
        }

        return c;
    }
}