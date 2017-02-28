import Memory from './Memory.js';
import CPU from './CPU.js';
import { default as _OPS } from './Cpu.OpSet.js';

export default class Device {

  static build(config = {}) {

    const device = new Device(config);

    return device;
  }

  constructor({ MEMORY_SIZE, OPS = _OPS }) {

    this.memory = new Memory(MEMORY_SIZE);

    this.cpu = new CPU(this.memory, OPS);
  }

  installOs(OsType) {

    this.os = new OsType(this.cpu, this.memory);

    this.os.device = this;

    return this;
  }

  launch(program) {

    this.cpu.reset();

    return this.os.boot(program);
  }

  shutdown() {

    this.os.shutdown();

    return this;
  }

  restart(program) {

    return this.shutdown().launch(program);
  }
}
