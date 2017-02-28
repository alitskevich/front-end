import Component from 'ui/Component.js';

export default class ListItemSelector extends Component {

  static TEMPLATE =
    `<span class="item">
        <input type="checkbox" id="selector-{{value}}" props=":inputProps" />
        <span><transclude/></span>
    </span>`;

  static PROPS = {
    class: { default: 'hidden' },
    value:{ },
    pattern: { },
    hideCheckbox: {}
  }

  get isSelected() {

    return this.value === this.pattern;
  }

  get inputProps() {
    const checked = this.isSelected ? { checked: true } : {};
    return { ...checked, style:`display:${this.hideCheckbox ? 'none' : 'inline'};margin-right:5px` };
  }
}

Component.registerType(ListItemSelector);
