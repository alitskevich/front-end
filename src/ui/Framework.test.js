import assert from 'assert';
import { bootstrap, Component, StringRenderer as renderer } from './Framework.js';

class Valuable extends Component {

  static TEMPLATE =`<em>{{value}}</em>`;

  static PROPS = {
    value: { default:'Empty' }
  };
}

class TranscludeSample extends Component {

  static TEMPLATE =`<em>(<transclude/>)</em>`;
}

class AllTemplateSample extends Component {

  static TEMPLATE =`
      <ul class="ui list">
          <!-- comment -->
          <li each="item of data" data-value="{{item.id}}">
          <p if="item.name">{{item.name}} &nbsp; </p></li>
          <block if="isEmpty">
            <then><small class="empty 'single quote'">:emptyMessage</small></then>
            <else>Total: {{data.length}}</else>
          </block>
          <block if="isNonEmpty">
            <then><small class="empty">:emptyMessage</small></then>
            <else>Total: {{data.length}}</else>
          </block>
          <TranscludeSample><p>{{data.length}}</p></TranscludeSample>
      </ul>;
  `;

  static PROPS = {
    data: {},
    emptyMessage: { default:'Empty' }
  };

  get isEmpty() {

    return !this.data.length;
  }

  get isNonEmpty() {

    return this.data.length;
  }
}
describe('Framework', function () {

  it('bootstrap', ()=>{

    const render = bootstrap({
      renderer,
      markup:`<div version=":version" name=":name"/>`,
      state: { version: 'Version', name:'Name' },
      componentTypes: []
    });

    assert.equal(render(), '<div version="Version" name="Name"/>');
  });

  it('template', ()=>{

    const render = bootstrap({
      renderer,
      Root:AllTemplateSample,
      state: { data: [{ id:'1', name:'Name1' }] },
      componentTypes: [TranscludeSample]
    });

    assert.equal(render(),
`<ul class="ui list">
<li data-value="1">
<p>\nName1   \n</p>\n</li>\nTotal: 1
<small class="empty">\nEmpty\n</small>
<em>\n(\n<p>\n1\n</p>\n)\n</em>
</ul>`);
  });

  it('update', ()=>{
    let root = null;
    class Root extends Component {

      static TEMPLATE =`<em>{{value}}</em>`;

      static PROPS = {
        value: { default:'Empty' }
      };

      constructor(state) {

        super(state);
        root = this;
      }
    }

    const render = bootstrap({
      renderer,
      Root
    });

    assert.equal(render(), `<em>\nEmpty\n</em>`);
    assert.equal(root.update({ value:'123' }), `<em>\n123\n</em>`);
  });

  it('props', ()=>{

    const render = bootstrap({
      renderer,
      markup: `<Valuable props=":meta"/>`,
      state: {
        meta: {
            value: 1
          }
      },
      componentTypes: [Valuable]
    });

    assert.equal(render(), `<em>\n1\n</em>`);
  });

  it('finalizer', (next)=>{

    const c = new Valuable();

    c.addFinalizer(()=>{
      next();
    });

    setTimeout(()=>c.onDone(), 10);
  });

});
