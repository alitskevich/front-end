import Pattern from '../Pattern.js';

export default [
  {
      id: 'Name',
      pattern: Pattern.create('latin')
  },
  {
      id: 'Criteria',
      pattern: Pattern.create('Name')
        .mayNext(x=>x.is('[').isNext('Name').isNext(']'))
        .mayNext(x=>x.is('*')),
      action: 'wrap'
  },
  {
      id: 'Pattern',
      pattern: Pattern.create('Criteria').separatedList('space')
  }

];
