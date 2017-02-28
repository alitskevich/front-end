const {SYMBOL_ALGORITHM_TYPE, SYMBOL_ALGORITHM_NAME} = require('./constants');

class Algorithm {

    /**
     * Execute algorithm
     *
     * @returns {AlgorithmResult} Algorithm result
     * */
    exec(/* ...args*/) {
        throw new Error('Not implemented');
    }

    /**
     * Getter for ["name"]{@link Algorithm#name}.
     *
     * @returns {string} Name.
     * */
    get name() {
        return this.constructor[Symbol.for(SYMBOL_ALGORITHM_NAME)];
    }

    /**
     * Getter for ["type"]{@link Algorithm#type}.
     *
     * @returns {string} type
     * */
    get type() {
        return this.constructor[Symbol.for(SYMBOL_ALGORITHM_TYPE)];
    }

}


module.exports = Algorithm;
