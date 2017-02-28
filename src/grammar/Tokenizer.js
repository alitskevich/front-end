import { tokenizer, RE_SIGN } from '../utils/text.js';
import Memoize from '../concepts/Memoize.js';
import { curry } from '../utils/fn.js';
import { objMap } from '../utils/obj.js';

export const SIGNS_INFO = objMap({
  ' ': { space: 1 },
  '.': { dot: 1 },
  ',': { comma: 1 },
  '+': { plus: 1 },
  '-': { minus: 1 },
  // '--': {classes:{dash:1},
  '#': { hash: 1 },
  $: { dollar: 1 },
  '%': { percent: 1 },
  '*': { asterisk:1 },
  '?': { question:1 },
  '!': { exclamation:1 },
  '(': { leftBrace:1 },
  ')': { rightBrace:1 },
  '[': { leftSquareBrace:1 },
  ']': { rightSquareBrace:1 },
  '&': { ampersand:1 },
  '|': { disj:1 },
  '~': { tilda:1 },
  ':': { colon:1 },
  // '': {classes:'quote',
  // '': {classes:'quote',
  '"': { quote: 1 },
  '\'': { apos: 1 },
  '’': { apos: 1 }
  // '\'': 'quote'
}, (value, key) =>({ ...value, sign:1, [key]:1 }));

const RE_DIGITS = /^\d+$/;
const reLat = /^[a-z]+$/i;
const reCyr = /^[а-яіўё]+$/i;

const classifyToken = Memoize.create((x) => {

  if (x.match(RE_DIGITS)) {

    return { token: true, number: true };
  }

  const length = x.length;
  const classes = { token: true, ['_' + x]: true, short: (length < 4), word: length > 2 };

  if (x.match(reLat)) {
    classes.latin = true;
  } else if (x.match(reCyr)) {
    classes.cyrilic = true;
  } else {
    classes.mixed = true;
  }

  if (length > 1 && x.toUpperCase() === x) {
    classes.abbr = true;
  } else if (x[0] === x[0].toUpperCase()) {
    classes.capital = true;
  }

  return classes;
});

export const textTokenizer = curry(tokenizer,
  RE_SIGN,
  function (lexon, [ text, sign ]) {

    const tags = !sign ? classifyToken(text) : SIGNS_INFO[text];

    lexon.newChild({ text, tags });
});
