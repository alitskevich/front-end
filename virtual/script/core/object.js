import {
   UNDEFINED,
  GET, SET,
  FALSE, TRUE,
   NEW_MAP, MAKE_MAP, MAP_HAS_KEY, MAP_GET, MAP_SET,
   STRING } from './_impl.js';
import { struct, field } from './struct.js';

const {
  f_Meta,
  f_Proto,
  Getter,
  Setter,
  IsEnumerable,
  IsConfigurable
} = field;

function lookupPropertyDescriptor($, Id) {

  // uses Proto chain if has no own property defined
  for (let target = $; target; target = GET($, f_Proto)) {
    let Meta = GET(target, f_Meta);
    let prop = MAP_GET(Meta, Id);
		if (prop !== UNDEFINED) {
			return prop;
		}
	}

  return UNDEFINED;
}

function ensureProperty($, Id) {

  let Meta = GET($, f_Meta);
  let prop = MAP_GET(Meta, Id);

  if (prop === UNDEFINED) {
    prop = struct.PropertyDescriptor({
      IsEnumerable: TRUE,
      IsConfigurable: TRUE
    });
    DefineProperty($, Id, prop);
  }
  return prop;
}

export function DefineProperty($, Id, Prop) {

  // const $prop = LookupPropertyDescriptor($, Id);
  // assert($prop.IsConfigurable, `property '${key}' is already defined`);

  // assert((IsReadOnly === $true) && Get, `No getter allowed for read-only property '${key}'`);

  MAP_SET($.Meta, Id, Prop);
}

const PROTO_PROPERTY = struct.PropertyDescriptor(
  Getter, (($, key) => GET($, f_Proto)),
  Setter, (($, key, value) => SET($, f_Proto, value)),
  IsEnumerable, FALSE,
  IsConfigurable, FALSE
);
const __lookupGetter__ = ($, Id)=>{
  const prop = lookupPropertyDescriptor($, Id);
  return prop ? prop.Getter : UNDEFINED;
};
const __lookupSetter__ = ($, Id)=>{
  const prop = lookupPropertyDescriptor($, Id);
  return prop ? prop.Setter : UNDEFINED;
};
const HasOwnProperty = ($, Id) => {

  return MAP_HAS_KEY($.Data, Id) || MAP_HAS_KEY($.Meta, Id);
};
const IsPrototypeOf = () => {
  return false;
};
const PropertyIsEnumerable = ($, Id) => {
  return lookupPropertyDescriptor($, Id).IsEnumerable;
};
const ROOT_STRING = STRING('[object Object]');
const ROOT = NEW_OBJECT({
  toString: ($) => ROOT_STRING,
  toLocaleString: ($) => ROOT_STRING,
  valueOf: ($)=>$,
  __defineGetter__: ($, Id, fn )=>{ ensureProperty($, Id).Getter = fn;},
  __defineSetter__: ($, Id, fn )=>{ ensureProperty($, Id).Setter = fn;},
  __lookupGetter__,
  __lookupSetter__,
  HasOwnProperty,
  IsPrototypeOf,
  PropertyIsEnumerable

}, null);

export function NEW_OBJECT(initials, Proto = ROOT) {

  const Meta = NEW_MAP();

  const Data = MAKE_MAP(initials);

  const $ = struct.Object({
    Meta,
    Data,
    Proto
  });

  if (Proto) {
    MAP_SET(Meta, STRING(`__Proto__`), PROTO_PROPERTY);
  }

  return $;
}

export function OBJECT_GET($, Id) {

  const prop = lookupPropertyDescriptor($, Id);

  if (prop && prop.Value) {

    return prop.Value;
  }

  if (prop && prop.Getter) {

    return prop.Getter($, Id);
  }

	for (let target = $; target; target = target.Proto) {
		if (MAP_HAS_KEY(target.Data, Id)) {
			return MAP_GET(target.Data, Id);
		}
	}

  return UNDEFINED;
}

export function OBJECT_SET($, Id, Value) {

  const prop = lookupPropertyDescriptor($, Id);

  if (prop && prop.Setter) {

     prop.Setter($, Id, Value);
  } else {

    MAP_SET($.Data, Id, Value);
  }

  // assert(prop.IsReadOnly, `property '${key}' is read only`);

}
