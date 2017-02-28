import Rule from './Rule.js';

let ALL = [];

export default class Grammar {

  static init = (meta) => (ALL = (meta.grammars || [])
    .map(g => (new Grammar(meta[g.id + 'Grammar']))));

  static apply = (lx) => ALL.forEach(g=>g.apply(lx));

  constructor(rules) {

    this.rules = rules.filter(e=>!e.disabled).map(e=>new Rule(e));
  }

  apply(root) {

    const first = root.first;

    if (!first) {
      return;
    }

    for (let hasChanges = true, countdown = 1; hasChanges && countdown; countdown--) {

      hasChanges = false;
          console.log('grammar--------');

      for (let rule of this.rules) {

        console.log('rule', rule.id);
        for (let lx = root.first, lxx; lx; lx = lx.next) {
          console.log('lx', lx);
        }

        let lx = first;
        while (!lx.isNil()) {
          if (lx.is(rule.id).isNil()) {
            let lxx = rule.apply(lx);
            if (!lxx.isNil()) {
              hasChanges = true;
              lx = lxx;
            } else {
              lx = lx.nextOrNil;
            }
          } else {
            lx = lx.nextOrNil;
          }
        }
      }
    }
  }
}
