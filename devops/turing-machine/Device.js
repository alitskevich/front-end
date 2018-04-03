import Memory from './Memory.js';
import CPU from './CPU.js';
import { default as _OPS } from './Cpu.OpSet.js';

export default class Device {

  static build(config = {}) {

    const device = new Device(config);

    return device;
  }

  constructor({ MEMORY_SIZE = Math.pow(2,32), OpSet = _OPS }) {

    const storage = ArrayBuffer(MEMORY_SIZE);
    const memory = new Uint16Array(storage);
    const registry = new Registry();

    const read = ($) => ($<0 ? registry.read($) : memory[$]);
    const write = ($, V) => { if ($<0){ registry.write($, V); } else { memory[$] = V; } }
    const next = () =>  memory[registry.IP++];

    const OPS = OpSet({ read, write, next, registry });

    this.reset = () => {

      registry.reset();

      for (let opcode = next(); opcode; opcode = next()) {

        OPS.call(null, opcode);
      }
    };

  }

  launch(OsType) {

    this.os = new OsType(this);

    this.reset();
  }

  shutdown() {

    this.os.shutdown();
  }

}
