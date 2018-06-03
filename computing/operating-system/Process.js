import Thread from './Thread.js';

export class Process {

  static newInstance(program) {

    return new Process(program);
  }

  constructor(program) {

    this.program = program;

    this.threads = new Set();
    this.mainThread = this.createNewThread(program, program.code);

    this.currentThreadIndex = 0;

    this.heap = new MemoryHeap(os.memory.retainSegment());
    this.stack = new MemoryStack(process.program.os.memory.retainSegment());
  }

  run(CS) {

    this.mainThread.run();
  }

  resume() {

  }

  pause() {

  }

  fork() {

  }

  exit() {
    this.DS.done();

  }

  createNewThread(program, code) {

    const thread = new Thread(program, this, code);

    this.threads.add(thread);
    this.program.os.threads.add(thread);

    return thread;
  }

  DeleteThread(thread) {

    this.threads.remove(thread);
    this.program.os.threads.remove(thread);
  }

}
