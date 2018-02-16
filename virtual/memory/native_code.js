import { MAKE } from './alloc';

const NOOP = ()=>0;
let NATIVE_CODE = [];

export function NATIVE_ADD(code) {

  const id = (NATIVE_CODE || (NATIVE_CODE=[])).length;

  NATIVE_CODE.push(code);

  return MAKE(0, id);
}

export function NATIVE_GET(id) {

  return NATIVE_CODE ? NATIVE_CODE[id] : NOOP;
}