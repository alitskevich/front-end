const MapProto = {
  Get__Size: ($) => HSIZE($.Value),
  Get: ($, Key) => HGET($.Value, Key),
  Set: ($, Key, Value) => HSET($.Value, Key, Value),
  ForEach: ($, fn) => HEACH($, (entry, index) => f(entry.Key, entry.Value, index)),
  ToString: ($) => JSON.stringify($.Value)
}

function MapConstructor($, initials) {
   $.Value = HASH(initials);
}

