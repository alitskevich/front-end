
import { MAP_SIZE } from './map';
import { GET, SIZE, TYPE } from './alloc';
import { TYPE_MAP, TYPE_STRING } from './_const';

export function MAP_INSPECT($) {

  const size = MAP_SIZE($);
  const type = TYPE($);
  const r=[];
  const Keys = GET($, 1);
  const Values = GET($, 0);
  for (let i = 0; i < size; i++) {
    const e = GET($, i);
    r.push(`${STRING_INSPECT(GET(Keys, i))}=${GET(Values, i)}`);
  }
  return `MAP${type===TYPE_MAP?'':'-'}:${size}{${r.join(', ')}}`;

}

export function STRING_INSPECT($) {

  const size = SIZE($);
  const type = TYPE($);
  if (type!==TYPE_STRING) {
    return "NOT_A_STRING"
  }
  const r=[];
  for (let i = 0; i < size; i++) {
    const e = GET($, i);
    r.push(String.fromCharCode(e));
  }
  return `"${r.join('')}"` ;

}