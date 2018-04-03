import MemoryHeap from './MemoryHeap.js';
import Process from './Process.js';

export default class Program {

  constructor(code) {

    this.code = code;
  }

  execute(os, params = []) {

    this.process = Process.newInstance(this);

    const CS = os.memory.retainSegment();

    CS.writeBytes(0, 2, this.process, this.code);

    this.run(CS);

  }

  run(CS) {

    this.process.run(CS);
  }

  exit(code) {

    this.CS.done();

      // ...
    return code;
  }
}
