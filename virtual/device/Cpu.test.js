import assert from 'assert';
import Cpu from './Cpu.js';

describe('Cpu', function () {

  it('registry', () => {

    const data = [1, 2, 3, 4, 0];

    const memory = {

      read: (i) => data[i]
    };

    const Ops = ({ cpu }) => (code) => () => ({ 0: cpu.AX + code });

    const cpu = new Cpu(memory, Ops);

    cpu.reset();

    assert.equal(cpu.AX, 9);
  });

  it('store', () => {

    const data = [1, 2, 3, 4, 5, 6, 7, 0];

    const memory = {

      read: (i) => data[i],
      write: (addr, byte) => (data[addr] = byte)
    };

    const Ops = ({ nextIp }) => (code) =>
      () => ({ [code]: nextIp() + nextIp() });

    const cpu = new Cpu(memory, Ops);

    cpu.reset();

    assert.equal(data[2], 7);
    assert.equal(data[5], 13);
  });

});
