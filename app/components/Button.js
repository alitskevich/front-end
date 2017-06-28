import Component from 'ui/Component.js';

export default class Button extends Component {

  static TEMPLATE =`<button
      class="ui primary button btn {{class}}"
      click="{{click}}"
      title="{{$title}}">{{caption}}</button>`;

  static PROPS = {
    caption: { default: '…' },
    click: { default: function (ev) { this.log('click', ev); } },
    title: { }
  };

  get $title() {

    return this.title || this.caption;
  }
}

Component.registerType(Button);
