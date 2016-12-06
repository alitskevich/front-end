const Algorithm = require('../Algorithm');
const AlgorithmResult = require('../AlgorithmResult');

const {algorithm} = require('../decorators');

const {TYPE_ALGORITHM_SORT} = require('../constants');

/**
 * @todo | perform experiments:
 * @todo | 1. Immutable operations vs mutable.
 * @todo | 2. Check StackOverflow case.
 * */
class QuickSort extends Algorithm {

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

        this.qsort(arr, 0, arr.length - 1);
        result.result = arr;

        result.stopTimer();

        return result;
    }

    /**
     * Quick sort algorithm implementation
     *
     * @param {*[]} arr - Target array.
     * @param {number} left - Left index.
     * @param {number} right - Right index.
     * */
    qsort(arr, left, right) {
        /*
         * Step 1. Select pivot element
         *
         * Choose the pivot element. Element at the middle of the subarray.
         * Algorithm effectiveness may depend on this step in very specific
         * cases.
         * */
        const pivot = arr[Math.floor((left + right) / 2)];

        let _left = left;
        let _right = right;


        while (_left <= _right) {
            /*
             * Step 2. Move from the left to the right while left element less then
             * pivot element.
             * */
            while (arr[_left] < pivot) {
                _left++;
            }

            /*
             * Step 3. Move from the right to the left while right element more then
             * pivot element.
             * */
            while (arr[_right] > pivot) {
                _right--;
            }

            if (arr[_left] > arr[_right]) {
                /*
                 * Step 4. Swap elements in case left element is more then right element.
                 * Then increment left and right indices.
                 * */
                this.swap(arr, _left, _right);
            }

            _left++;
            _right--;
        }


        /*
        * Step 5. Continue sorting recursively while subarray.length will be 1.
        * */
        if (left < _right) {
            this.qsort(arr, left, _right);
        }

        if (right > _left) {
            this.qsort(arr, _left, right);
        }
    }

    /**
     * Swap elements in array
     *
     * @param {*[]} arr - Target array.
     * @param {number} left - Left index.
     * @param {number} right - Right index.
     * */
    swap(arr, left, right) {
        const temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
    }

}


module.exports = algorithm(TYPE_ALGORITHM_SORT, 'quick-sort')(QuickSort);
