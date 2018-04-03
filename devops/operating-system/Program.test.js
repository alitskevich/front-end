import assert from 'assert';
import Device from './Device.js';
import OS from '../os/OS.js';

export const device = Device.build().installOs(OS);

describe('Program', function () {

  it('launch', () => {

    const program = {
      execute(cpu, heap) {
        heap.write(0, 'ok');
        return heap.read(0);
      }
    };

    assert.equal(device.launch(program), 'ok');
  });

});
