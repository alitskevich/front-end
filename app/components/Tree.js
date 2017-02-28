import Component from 'ui/Component.js';
import { xmlParse } from 'utils/xml.js';

export default class Tree extends Component {

  static TEMPLATE =
    <div class="ui list tree">
        <div each="item of :data" click=":updateOnClick" class="item {{itemClass}}" data-value=":item.id">
          <i class="icon folder"></i>
          <div class="content">
            <div class="header">:item.name</div>
            <div class="description">:item.name</div>
            <Tree if=":item.children" data=":item.children" valueChanged=":valueChanged"/>
          </div>
        </div>
        <small class="empty" if=":isEmpty"><transclude/></small>
    </div>;

  static PROPS = {
    value: { default: null },
    valueChanged:{ },
    data: { default: [] },
    transclude: { default: xmlParse('<b>Empty tree</b>') }
  }

  get itemClass() {

    const item = this.get('item');

    return item.id === this.value ? 'selected' : '';
  }

  get size() {

    return this.data.length;
  }

  get isEmpty() {

    return this.size === 0;
  }

}

Component.registerType(Tree);
