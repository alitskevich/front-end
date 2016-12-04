const {SYMBOL_ALGORITHM_TYPE, SYMBOL_ALGORITHM_NAME} = require('../constants');


function algorithm(type, name) {

    return function(Clazz) {
        Clazz[Symbol.for(SYMBOL_ALGORITHM_TYPE)] = type;
        Clazz[Symbol.for(SYMBOL_ALGORITHM_NAME)] = name;

        return Clazz;
    }
}


module.exports = algorithm;
