//internal tuple
const TUPLE = (...vals) => vals
const TUPLE_GET = (s, i) => vals[i]
const TUPLE_SET = (s, i, v) => { vals[i] = v }

const SetProto = {
  Size: ($) => TUPLE_SIZE($.Internal),
  Get: ($, i) => TUPLE_GET($.Internal, i),
  Set: ($, i, Value) => TUPLE_SET($.Internal, i, Value),
  ForEach: ($, fn) => ForEach($, (entry, index) => f(entry.Key, entry.Value, index)),
  ToString: ($) => JSON.stringify($.Internal)
}

function SetConstructor($, initials) {
   $.Value = TUPLE(initials);
}
