import {
  $null, $undefined,
  Read,
  $typeOf, assert,
  $String
} from '../_core';

import {
  $Function
} from '../function';

import {
  $Object, Assign,
  __defineGetter__,
  __defineSetter__,
  __lookupGetter__,
  __lookupSetter__,
  HasOwnProperty,
  IsPrototypeOf,
  LookupPropertyDescriptor,
  GetProperty,
  KEY_PROTOTYPE,
  KEY_IS_ENUMERABLE
} from '../object';

const KEY_LOOKUP_GETTER = $String('__lookupGetter__');
const KEY_LOOKUP_SETTER = $String('__lookupSetter__');

const ToString = ($) => `[${GetProperty($, 'Constructor').name}]`;

export const ObjectPrototype = $Object({

}, $undefined);

export const Get = ($, key) => GetProperty(KEY_LOOKUP_GETTER).call($, key);
export const Set = ($, key, value) => GetProperty(KEY_LOOKUP_SETTER).call($, key, value);

export const ObjectConstructor = $Function({

  Body:($) => { },

  Prototype: ObjectPrototype,

  New(Constructor, ...Arguments) {

    const $ = $Object({}, GetProperty(Constructor, KEY_PROTOTYPE));

    // constructing
    Constructor.apply($, Arguments);

    return $;
  }

});

Assign(ObjectConstructor, {

   Create(prototype) {

     const type = $typeOf(prototype);

     assert(type === 'object' || prototype === $null,
      `Object prototype may only be an Object or null: undefined ${type}`,
      TypeError
     );

     return $Object(prototype);
   },

   Assign(Target, ...Sources) {

     assert(Target, `Unable to assign to ${Target}`);

     Sources.forEach( Source => Assign(Target, Source));

     return Target;
   },

   Keys($) {

     const preceding = $.__Proto__ ? $.__Proto__.GetKeys() : [];

     const own = $.GetOwnKeys().filter(Id => !preceding.includes(Id));

     return [...preceding, ...own];
   },

   GetOwnKeys: ($) => [...$.Data.Keys()].filter(p => p.IsEnumerable).map(p => p.Id)

 });
