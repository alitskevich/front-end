const Algorithm = require('../Algorithm');
const AlgorithmResult = require('../AlgorithmResult');

const Heap = require('../../data-structures/Heap');

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

        result.result = this.heapSort(arr);

        result.stopTimer();

        return result;
    }

    /**
     * Heap sort algorithm implementation.
     *
     * @param {*[]} arr - Target array.
     *
     * @returns {*[]} Sorted array.
     * */
    heapSort(arr) {
        /*
         * Step 1. Build heap from target array
         * */
        const heap = new Heap(arr);

        const sortedArray = [];

        while(!heap.empty) {
            /*
            * Step 2. Unshift elements from the heap's top to the sorted array.
            * */
            sortedArray.unshift(heap.remove());
        }

        return sortedArray;
    }
}

module.exports = algorithm(TYPE_ALGORITHM_SORT, 'heap-sort')(HeapSort);
