import Component from 'ui/Component.js';

export default class List extends Component {

  static TEMPLATE =
    `<ul class="ui list">
        <li each="item of data"
          click=":updateOnClick"
          data-value=":item.id">
          <ListItemSelector
          value="{{item.id}}"
          pattern="{{value}}"
          hideCheckbox="true"
          >
          <span>{{item.name}}</span>
          </ListItemSelector>
          </li>
        <block if="data.length">
          <else><small class="empty">:emptyMessage</small></else>
        </block>
    </ul>`;

  static PROPS = {
    value: { default: null },
    valueChanged:{ },
    data: { default: [] },
    emptyMessage: { default: 'Empty list' }
  }
}

Component.registerType(List);
