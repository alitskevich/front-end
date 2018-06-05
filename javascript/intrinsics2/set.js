const SetPrototype = {
  Size: ($) => TUPLE_SIZE($.Internal),
  Add: ($, Value) => TUPLE_SET($.Internal, Value),
  ForEach: ($, fn) => ForEach($, (entry, index) => fn(entry.Key, entry.Value, index)),
  ToString: ($) => JSON.stringify($.Internal)
}

function SetConstructor($, initials) {
   $.Exotic = initials;
}
