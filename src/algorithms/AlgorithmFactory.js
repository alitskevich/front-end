const sort = require('./sort');

const {SYMBOL_ALGORITHM_TYPE, SYMBOL_ALGORITHM_NAME} = require('./constants');


class AlgorithmFactory {

    constructor() {
        this.algorithms = {};

        this._init(Object.values(sort));
    }

    /**
     * Create new algorithm instance
     *
     * @param {Object} opts - Creation options.
     * @param {string} opts.type - Algorithm type (e.g "sort").
     * @param {string} opts.name - Algorithm name.
     *
     * @returns {Algorithm}
     * */
    create(opts) {
        const Algorithm = this._resolve(opts.type, opts.name);

        if (!Algorithm) {
            throw new Error(`No such algorithm "${type}:${name}"`);
        }

        return new Algorithm();
    }

    /**
     * Initialize algorithms register. Group this register by types.
     *
     * @param {Algorithm[]} types
     * */
    _init(types) {
        const symbolType = Symbol.for(SYMBOL_ALGORITHM_TYPE);
        const symbolName = Symbol.for(SYMBOL_ALGORITHM_NAME);

        types.forEach(clazz => {
            const typeName = clazz[symbolType];
            const name = clazz[symbolName];

            if (this.algorithms.hasOwnProperty(typeName)) {
                this.algorithms[typeName][name] = clazz;
            } else {
                this.algorithms[typeName] = {
                    [name]: clazz
                };
            }
        });
    }

    /**
     * Resolve algorithm by type and instance.
     *
     * @param {string} type - Algorithm type (e.g "sort").
     * @param {string} name - Algorithm name.
     *
     * @returns {Function} Algorithm constructor.
     * */
    _resolve(type, name) {
        const group = this.algorithms[type];
        return group ? group[name] : null;
    }

}


module.exports = AlgorithmFactory;
