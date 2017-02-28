import { fnId, fnNull, fnTrue } from '../utils/fn.js';

const Nil = {};

const fnNil = () => Nil;

Object.assign(Nil, {
  text: null,
  is:fnNil,
  isAny:fnNil,
  isNext:fnNil,
  next: Nil,
  nextOrNil: Nil,
  someOrNull: fnNull,
  someOrElse: fnId,
  isNil: fnTrue,
  inspect: ()=>'Nil'
});

export default Nil;
