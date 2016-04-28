const PIPES = {};

export default{

    add(k, v) {
        PIPES[k] = v
    },

    apply(value, pipes) {

        if (typeof pipes==='string'){
            pipes = pipes.split('|');
        }

        return pipes.map(p => p.trim()).filter(p=>PIPES[p]).reduce((value, p)=>PIPES[p](value), value)
    }
}