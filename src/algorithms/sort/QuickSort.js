const Algorithm = require('../Algorithm');
const AlgorithmResult = require('../AlgorithmResult');

const {algorithm} = require('../decorators');

const {TYPE_ALGORITHM_SORT} = require('../constants');


class QuickSort extends Algorithm {

    /**
     * Execute algorithm
     *
     * @param {*[]} iterable
     *
     * @returns {*} Algorithm result
     * */
    exec(iterable) {
        const result = new AlgorithmResult(this);

        result.startTimer();

        // TODO algorithm implementation

        result.result = null;
        result.stopTimer();

        return result;
    }

}


module.exports = algorithm(TYPE_ALGORITHM_SORT, 'quick-sort')(QuickSort);
