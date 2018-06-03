/**
 * The JSON object contains methods for parsing JavaScript Object Notation (JSON) and converting values to JSON.
 *
 * It can't be called or constructed, and aside from its two method properties it has no interesting functionality of its own.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
 *
 */

export const GRAMMAR = ` 
JSON = null or true or false or JSONNumber or JSONString or JSONObject or JSONArray

 JSONNumber = - PositiveNumber or PositiveNumber
 PositiveNumber = DecimalNumber or DecimalNumber . Digits or DecimalNumber . Digits ExponentPart or DecimalNumber ExponentPart
 DecimalNumber = 0 or OneToNine Digits
 ExponentPart = e Exponent or E Exponent
 Exponent = Digits or + Digits or - Digits
 Digits = Digit or Digits Digit
 Digit = 0 through 9
 OneToNine = 1 through 9

 JSONString = "" or " StringCharacters "
 StringCharacters = StringCharacter or StringCharacters StringCharacter
 StringCharacter = any character except " or \\ or U+0000 through U+001F or EscapeSequence
 EscapeSequence = \\" or \\/ or \\\\ or \\b or \\f or \\n or \\r or \\t or \\u HexDigit HexDigit HexDigit HexDigit
 HexDigit = 0 through 9 or A through F or a through f

 JSONObject = { } or { Members }
 Members = JSONString : JSON or Members , JSONString : JSON
 JSONArray = [ ] or [ ArrayElements ]
 ArrayElements = JSON or ArrayElements , JSON`;

export default {

  parse: function (sJSON) {
    return eval('(' + sJSON + ')');
  },

  stringify: (function () {
    var toString = Object.prototype.toString;
    var isArray = Array.isArray || function (a) {
      return toString.call(a) === '[object Array]';
    };
    var escMap = { '"': '\\"', '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t' };
    var escFunc = function (m) {
      return escMap[ m ] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1);
    };
    var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
    return function stringify(value) {
      if (value == null) {
        return 'null';
      } else if (typeof value === 'number') {
        return isFinite(value) ? value.toString() : 'null';
      } else if (typeof value === 'boolean') {
        return value.toString();
      } else if (typeof value === 'object') {
        if (typeof value.toJSON === 'function') {
          return stringify(value.toJSON());
        } else if (isArray(value)) {
          var res = '[';
          for (var i = 0; i < value.length; i++)
            res += (i ? ', ' : '') + stringify(value[ i ]);
          return res + ']';
        } else if (toString.call(value) === '[object Object]') {
          var tmp = [];
          for (var k in value) {
            if (value.hasOwnProperty(k))
              tmp.push(stringify(k) + ': ' + stringify(value[ k ]));
          }
          return '{' + tmp.join(', ') + '}';
        }
      }
      return '"' + value.toString().replace(escRE, escFunc) + '"';
    };
  })()
};