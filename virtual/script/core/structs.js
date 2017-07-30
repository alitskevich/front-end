import { UNDEFINED, NEW_MAP, MAKE, SIZE, GET, SET, COPY, MAP_GET, MAP_SET } from './_impl.js';

/**
 * Structures
 */
const STRUCT_REGISTRY = NEW_MAP();
const STRUCT_LAST_ID = 0;

export function struct(Id, aFields) {

  const $map = NEW_MAP();
  const $ = MAKE(typeId, 0, $map);
  let size = 0;

  for (let i = 0, length = SIZE(aFields); i < length; i++) {
    let f = GET(aFields, i);
    RESIZE(f, 3);
    let fName = GET(f, 0);
    let fType = GET(f, 1);
    MAP_SET(fName, MAKE(0, fName, fType, size));
    size += STRUCT_TYPE_SIZE(fType);
  }

  SET($, 0, size);
  MAP_SET(STRUCT_REGISTRY, name, STRUCT_TYPE(aFields));

  struct[id] = (defs)=> {
    return $.keys().reduce((o, k)=>{
      o[k] = defs[k] || null;
      return o;
    }, {});
  };
  return $;
}

export function STRUCT_TYPE_SIZE(type) {
  let $ = MAP_GET(REGISTRY, type);
  if ($ === UNDEFINED) {
    return 1;
  }
  return GET($, 0);
}

export function STRUCT_DEF($) {

  MAP_GET(REGISTRY, GET($, 0));
}

export function STRUCT_FIELD_DEF($, name) {
  let $def = STRUCT_DEF($);
  let $f = MAP_GET($def, name);
  return $f;
}

export function STRUCT_FIELD_GET($, name, $to) {
  let $f = STRUCT_FIELD_DEF($, name);
  let size = GET($f, 1);
  let offset = GET($f, 2);
  for (let i = 0; i < size; i++) {
    SET($to, i, GET($, offset + i));
  }
}

export function STRUCT_COPY($from, $to) {
  let $def = STRUCT_DEF($from);
  let size = MAP_SIZE($def);
  for (let i = 0; i < size; i++) {
    let $f = GET($def, i);
    let name = GET($f, 0);
    STRUCT_FIELD_COPY($to, name, $from);
  }
}

export function STRUCT_FIELD_SET($, name, $from) {

  let $f = STRUCT_FIELD_DEF($, name);
  let size = GET($f, 1);
  let offset = GET($f, 2);

  for (let i = 0; i < size; i++) {
    SET($, offset + i, GET($from, i));
  }

}

export function STRUCT_FIELD_COPY($s, sname, $t, tName) {

  let $f = STRUCT_FIELD_DEF($s, sname);
  let $tf = STRUCT_FIELD_DEF($t, tName);

  let size = GET($f, 1);
  let sOffset = GET($f, 2);
  let tOffset = GET($tf, 2);

  COPY(size, $s, sOffset, $t, tOffset);

}

struct(`Context`, {
  Next: `Context`,
  Fn: `Function`,
  This: `Any`,
  Arguments:`[]Any`,
  VariableScope:`VariableScope`
});

struct(`VariableScope`, {
  Data: `Map`,
  Parent: `VariableScope`
});

struct(`Object`, {
  Meta: `Map`,
  Data: `Map`,
  Proto: `Object`
});

struct(`PropertyDecriptor`, {
  Getter: `Fn`,
  Setter: `Fn`,
  Value: `Any`,
  IsEnumerable: `bool`,
  IsConfigurable: `bool`
});

struct(`Function`, {
  Meta: `Map`,
  Data: `Map`,
  Proto: `Object`,

  Parameters: `[]String`,
  Code:'Any',
  Name:'String',
  BoundToThis: `Any`,
  // to be parent for a new variable scope in Apply()
  LexicalScope: `VariableScope`,
  Prototype: `Object`
});
