class Heap {

    /**
     * Constructor
     *
     * @param {*[]} [source]
     * */
    constructor(source = null) {
        this._heap = [];

         if (Array.isArray(source)) {
            source.forEach(item => this.add(item));
        }
    }

    /**
     * Getter for ["length"]{@link Heap#length}.
     *
     * @returns {number} Heap length.
     * */
    get length() {
        return this._heap.length;
    }

    /**
     * Getter for ["empty"]{@link Heap#empty}.
     *
     * @returns {boolean} Is empty.
     * */
    get empty() {
        return !this.length;
    }

    /**
     * Add new element to the heap tree. Add element to the tree bottom
     * and move it to the top to restore the tree <=> match requirement (parent > child#1 && parent > child#2)
     *
     * @param {*} element
     * */
    add(element) {
        const n = this._heap.length;

        let index;

        /*
         * Step 1. Add element to the end of array.
         * */
        this._heap[n] = element;

        /*
         * Start iteration from the end.
         * */
        index = n;

        /*
         * Step 2. Restore heap tree to match heap requirements (parent > child#1 && parent > child#2).
         * Swap new element with the parent while requirement (parent > child#1 && parent > child#2)
         * became true or while we reach heap tree root element.
         * */
        while (index > 1 && this._heap[index] > this._heap[index / 2]) {
            this._swap(this._heap, index, index / 2);

            index /= 2;
        }
    }

    /**
     * Remove element from the heap top. And restore tree structure.
     * */
    remove() {
        const top = this._heap[1];

        const n = this._heap.length;

        let index;

        /*
        * Step 1. Set last element as tree root.
        * */
        this._heap[1] = this._heap[n - 1];

        /*
         * Start iteration from the top.
         * */
        index = 1;

        /*
         * While has child
         * */
        while (index * 2 <= n) {
            let max;

            let firstChildIndex = index * 2;
            let secondChildIndex = firstChildIndex + 1;

            /*
            * If node has second child and this child is more then first -> set second's
            * child index as max.
            * */
            if (secondChildIndex <= n && this._heap[secondChildIndex] > this._heap[firstChildIndex]) {
                max = secondChildIndex;
            } else {
                max = firstChildIndex;
            }

            if (this._heap[index] < this._heap[max]) {
                /*
                * If on of the child is more then parent then hep rule is broken, so restore it.
                * */
                this._swap(this._heap, index, max);
            } else {
                /*
                * Tree structure has restored. Stop execution.
                * */
                break;
            }

            index = max;
        }

        return top;
    }

    /**
     * Swap elements in array.
     *
     * @param {*[]} target - Target array.
     * @param {number} indexA
     * @param {number} indexB
     * */
    _swap(target, indexA, indexB) {
        let tmp = target[indexA];
        target[indexA] = target[indexB];
        target[indexB] = tmp;
    }

}


/**
 * Implement iterator behavior
 * */
Heap.prototype[Symbol.iterator] = function*() {
    for (let item of this._heap) {
        yield item;
    }
};


module.exports = Heap;
