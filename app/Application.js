import Component from 'ui/Component.js';
import Store from './Store.js';
import TEMPLATE from './Application.html';

export default class Application extends Component {

  static TEMPLATE = TEMPLATE;

  static PROPS = {
    name: {},
    version: {},
    current: {}
  };

  onInit() {

    Store.addObserver((event)=>this.invalidate(), this._id);
  }

  onDone() {

    Store.removeObserver(this._id);
  }

  get columns() {
    return [
      {
        id:'name',
        width:80,
        required: true
      },
      {
        id:'value',
        width:40,
        required: true
      },
      {
        id:'key',
        width:50,
        required: false
      },
      {
        id:'key2',
        width:40,
        required: false
      },
      {
        id:'key3',
        width:60,
        required: false
      }
    ];
  }

  get counter() {

    return Store.counter;
  }

  get list() {

    return Store.list;
  }

  get odd() {

    return this.counter % 2 === 1;
  }

  get listType() {

    return 'SuperTable';
    // this.odd ? 'List' : 'Tree';
  }

  increment() {

    Store.incCounter();
  }

  decrement() {

    Store.incCounter(-1);
  }

  onItemSelected({ value }) {

    this.current = value;
  }
}

Component.registerType(Application);
