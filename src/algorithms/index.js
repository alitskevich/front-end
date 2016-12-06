const AlgorithmFactory = require('./AlgorithmFactory');

const {
    TYPE_ALGORITHM_SORT
} = require('./constants');


const factory = new AlgorithmFactory();


const result = factory
    .create({
        type: TYPE_ALGORITHM_SORT,
        name: 'quick-sort',
    })
    .exec()
    .save();


console.log(`Algorithm ${result.algorithmType}:${result.algorithmName} executed in ${result.elapsedTime}ms`);
