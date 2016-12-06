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
  .exec([2, 8, 7, 16, 5, 11])
  .save();


console.log(`
    Algorithm ${result.algorithmType}:${result.algorithmName} executed in ${result.elapsedTime}ms
    with result ${result.result}
`);
