const Algorithm = require('../Algorithm');
const AlgorithmResult = require('../AlgorithmResult');

const {algorithm} = require('../decorators');

const {TYPE_ALGORITHM_SORT} = require('../constants');


class HeapSort extends Algorithm {

    /**
     * Execute algorithm
     *
     * @param {*[]} arr - Target array.
     *
     * @returns {*} Algorithm result
     * */
    exec(arr) {
        const result = new AlgorithmResult(this);

        result.startTimer();

        this.heapSort(arr);
        result.result = arr;

        result.stopTimer();

        return result;
    }

    heapSort(arr) {

    }

    swap() {

    }
}


module.exports = algorithm(TYPE_ALGORITHM_SORT, 'heap-sort')(HeapSort);
