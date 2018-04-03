import assert from 'assert';
import Device from './Device.js';

describe('Device', function () {

  it('launch', () => {

    const OS = ()=>({

      shutdown: ()=>true,

      boot: program => program.execute(this)
    });

    const program = {

      execute: (cpu, heap) => 'ok'
    };

    const device = Device.build().installOs(OS);

    assert.equal(device.launch(program), 'ok');
    assert.equal(device.restart(program), 'ok');
  });

});
