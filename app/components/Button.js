import Component from 'ui/Component.js';

export default class Button extends Component {

  static TEMPLATE =
    <button
      class="ui primary button btn"
      click=":click"
      title=":title">:caption</button>;

  static PROPS = {
    caption: { default: '...' },
    click: { default: function (ev) { this.log('click', ev); } },
    title: { get: ($, key) => $.state[key] || $.caption }
  };
}

Component.registerType(Button);
