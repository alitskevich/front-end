import Nil from './Nil.js';

const ACTION_DEFAULT = lx => lx.nextOrNil;

const ACTIONS = {

  wrap: function (base, target) {

    return base.wrap(target);
  },
  remove: function (base, target) {
    const result = base.nextOrNil;
    base.parent = null;
    return result;
  },

  merge: function (base, target) {

    let text = base.range(target).reduce((s, lx)=>(s + lx.text), '');

    return base.wrap(target).setText(text).nextOrNil;
  }

};

export default class Rule {

  static create(id, pattern, action) {

    return new Rule({ id, pattern, action });
  }

  static registerAction(id, action) {

    ACTIONS[id] = action;
  }

  constructor(options) {

    Object.assign(this, options);
  }

  get action() {

    return this._action || ACTION_DEFAULT;
  }

  set action(action) {

    this._action = ((typeof action === 'string') ? ACTIONS[action] : action);
  }

  apply(base) {

    const target = this.pattern.apply(base);

    if (!target.isNil()) {
      console.log(this.id, base, target);

      base.setMarker(this.id, target);

      const result = this.action.call(this, base, target);

      if (!result.isNil() && result !== base) {

        result.tags = { [this.id]: 1 };
      }

      return result;
    }

    return Nil;
  }

  toString() {

    return '' + this.id;
  }
}
