const Algorithm = require('./Algorithm');


class AlgorithmResult {

    /**
     * Constructor
     *
     * @param {Algorithm} algorithm
     * */
    constructor(algorithm) {
        if (!algorithm && !(algorithm instanceof Algorithm)) {
            throw new Error('Bad arguments.');
        }

        this._result = null;

        this.algorithm = algorithm;

        this.startTime = null;
        this.endTime = null;
    }

    /**
     * Getter for ["algorithmType"]{@link AlgorithmResult#algorithmType}.
     *
     * @returns {string} Algorithm's type
     * */
    get algorithmType() {
        return this.algorithm.type;
    }

    /**
     * Getter for ["algorithmName"]{@link AlgorithmResult#algorithmName}.
     *
     * @returns {string} Algorithm's name
     * */
    get algorithmName() {
        return this.algorithm.name;
    }

    /**
     * Getter for ["result"]{@link AlgorithmResult#result}.
     *
     * @returns {*} Result.
     * */
    get result() {
        return this._result;
    }

    /**
     * Setter for ["result"]{@link AlgorithmResult#result}.
     *
     * @param {*} value
     * */
    set result(value) {
        this._result = value;
    }

    /**
     * Getter for ["elapsedTime"]{@link AlgorithmResult#elapsedTime}.
     * Stops timer if it hasn't stopped yet.
     *
     * @returns {number} Elapsed time.
     * */
    get elapsedTime () {
        if (!this.startTime && !this.endTime) {
            return -1;
        } else if (this.startTime) {
            // TODO check if this is reasonable. Could be deleted.
            this.stopTimer();
        }

        return this.endTime - this.startTime;
    }

    /**
     * Start timer.
     *
     * @returns {AlgorithmResult}
     * */
    startTimer() {
        this.startTime = new Date();
        return this;
    }

    /**
     * Stop timer.
     *
     * @returns {AlgorithmResult}
     * */
    stopTimer() {
        this.endTime = new Date();
        return this;
    }

    /**
     * Save the result.
     *
     * @todo implement this function
     * @returns {AlgorithmResult}
     * */
    save() {
        return this;
    }

}


module.exports = AlgorithmResult;
