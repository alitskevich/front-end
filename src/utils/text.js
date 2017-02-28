export const RE_SIGN = /([^a-zа-я0-9іўё])/gi;

export const tokenizer = (re = RE_SIGN, fx, s, ctx = null) => {

  let counter = 0, lastIndex = 0, text, textE = [];

  for (let e = re.exec(s); e; e = re.exec(s)) {

    // preceding text
    text = e.index && s.slice(lastIndex, e.index);
    if (text) {
      textE[0] = text;
      fx(ctx, textE, counter++);
    }

    // matching
    fx(ctx, e, counter++);

    // up past index
    lastIndex = re.lastIndex;
  }

  // tail text
  text = s.slice(lastIndex);
  if (text) {
    textE[0] = text;
    fx(ctx, textE, counter++);
  }

  return ctx;

};
