
class QuickSort extends Algorithm {
    /**
     * Quick sort algorithm implementation
     *
     * @param {*[]} arr - Target array.
     * @param {number} left - Left index.
     * @param {number} right - Right index.
     * */
    do(arr, left, right) {
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

    swap(arr, left, right) {
        const temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
    }

}
