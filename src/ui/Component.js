import { fnId } from '../utils/fn.js';
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

  // implements reaction on component invalidation
  invalidate() {

    return this.render();
  }

  // renders component using given renderer function.
  // By default, renderer function comes from `this.$renderParams.renderer`
  render(renderer = this.$renderParams && this.$renderParams.renderer || fnId) {

    if ( !this.$isDone) {

      renderer(this.resolveTemplate(), this);
    }
  }

  // returns internal structure built on template and current state
  resolveTemplate() {

    return Template.resolve(this);
  }

  // Updates State with given delta on mute
  updateOnMute(delta) {

    return super.update(delta);
  }

  // Updates State with given delta
  update(delta) {

    const changes = this.updateOnMute(delta);

    if (this.shouldInvalidateOnUpdate(changes)) {

      this.invalidate();
    }
    return changes;
  }

  // decided if component should Invalidate itself On Update
  shouldInvalidateOnUpdate(changes) {

    return changes.length || Template.hasTransclusion(this);
  }

  // Useful routine implemented typical reaction on click event
  updateOnClick({ dataset }) {

    this.update(dataset);
  }
}
