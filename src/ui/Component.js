import { fnId } from '../utils/fn.js';
import { parseDataset } from '../utils/dom.js';
import Template from './Template.js';
import Property from '../concepts/Property.js';
import Component from '../concepts/Component.js';

/**
 * The base UI component.
 */
export default class UiComponent extends Component {

  static registerType = (...ctors) => ctors.forEach(ctor => {
    Template.install(ctor);
    Property.install(ctor);
  });

  static getRegisteredType = Template.getType;

  // Lifetime hook - on state reset from renderer flow
  onInput(payload) {

    this.update(payload);
  }

  // implements reaction on component invalidation
  invalidate(changed) {

    return this.render();
  }

  // renders component using given renderer function.
  // By default, renderer function comes from `this.$renderParams.renderer`
  render(renderer = this.$renderParams.renderer || fnId) {

    return renderer(this.resolveTemplate(), this);
  }

  // returns internal structure built on template and current state
  resolveTemplate() {

    return Template.resolve(this);
  }

  // @deprecated use update()
  assign(delta) {

    return this.update(delta);
  }

  // Updates State with given delta
  update(delta) {

    const changed = super.update(delta);

    return this.invalidate(changed);
  }

  // Useful routine implemented typical reaction on click event
  updateOnClick({ currentTarget: { dataset } }) {

    this.update(parseDataset(dataset));
  }
}
