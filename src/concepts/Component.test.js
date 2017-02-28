import assert from 'assert';
import Component from './Component.js';

class Valuable extends Component {

  static TEMPLATE =`<em>{{value}}</em>`;

  static PROPS = {
    value: { default:'Empty' }
  };

  onInit() {
    this.value = 1;
  }
}
Component.install(Valuable);

describe('Component', function () {

  it('init', ()=>{

    const c = new Valuable();

    assert.equal(c.value, Valuable.PROPS.value.default, 'default value:' + c.value);

    c.onInit();

    assert.equal(c.value, 1, 'initial value:' + c.value);

  });

  it('done', (next)=>{

    const c = new Valuable();

    c.addFinalizer(()=>{
      next();
    });

    setTimeout(()=>c.onDone(), 10);
  });

});
